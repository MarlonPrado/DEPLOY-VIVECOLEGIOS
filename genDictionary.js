const fs = require('fs');
const path = require('path');
const { readdirSync, statSync } = require('fs');

// Función para leer recursivamente los modelos (Se mantiene el existente)
const findModels = (dir) => {
    let models = {};
    const items = readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            // Si es un directorio, busca recursivamente
            const subModels = findModels(fullPath);
            models = { ...models, ...subModels };
        } else if (item.endsWith('.ts') && !item.includes('.test.') && !item.includes('.spec.')) {
            try {
                // Leer archivo
                const content = fs.readFileSync(fullPath, 'utf8');

                // Extraer nombre de clase/modelo usando expresiones regulares
                const classMatch = content.match(/@ObjectType\([^)]*\)\s*@Entity\([^)]*\)\s*export\s+class\s+(\w+)/);
                if (classMatch) {
                    const modelName = classMatch[1];

                    // Extraer descripción
                    const descMatch = content.match(/@ObjectType\(\{\s*description:\s*["']([^"']+)["']/);
                    const description = descMatch ? descMatch[1] : `Modelo ${modelName}`;

                    // Extraer propiedades
                    const properties = {};
                    const propertyMatches = [...content.matchAll(/@Field\([^)]*\)\s*@Column\([^)]*\)\s*(\w+)\??\s*:/g)];

                    for (const propMatch of propertyMatches) {
                        const propName = propMatch[1];
                        // Extraer descripción de la propiedad
                        const propContent = content.substring(propMatch.index, propMatch.index + 200);
                        const propDescMatch = propContent.match(/@Field\(\{\s*description:\s*["']([^"']+)["']/);
                        properties[propName] = propDescMatch ? propDescMatch[1] : propName;
                    }

                    // Extraer relaciones
                    const relationships = [];
                    const relationMatches = [...content.matchAll(/@ManyToOne|@OneToMany|@OneToOne|@ManyToMany/g)];
                    if (relationMatches.length > 0) {
                        for (const relMatch of relationMatches) {
                            const relContent = content.substring(relMatch.index, relMatch.index + 200);
                            const typeMatch = relContent.match(/type:\s*=>\s*(\w+)/);
                            if (typeMatch) {
                                relationships.push(typeMatch[1]);
                            }
                        }
                    }

                    // Categorizar por carpeta
                    const relativePath = path.relative(path.join(__dirname, 'backend', 'app', 'graphql', 'models'), dir);
                    const category = relativePath.split(path.sep)[0] || 'general';

                    // Añadir al diccionario
                    if (!models[category]) {
                        models[category] = {};
                    }

                    models[category][modelName] = {
                        description,
                        properties,
                        relationships: [...new Set(relationships)] // Eliminar duplicados
                    };
                }
            } catch (e) {
                console.error(`Error procesando ${fullPath}:`, e);
            }
        }
    }

    return models;
};

// Función para mezclar automático + personalizado
const generateMixedDictionary = () => {
    // Ruta de los modelos
    const modelsPath = path.join(__dirname, 'backend', 'app', 'graphql', 'models');

    // 1. Generar automáticamente
    const autoDictionary = {
        models: findModels(modelsPath),
        constants: {
            experienceLearningType: {
                "TRADITIONALVALUATION": "Evaluación tradicional",
                "SELFAPPRAISAL": "Autoevaluación",
                "COEVALUATION": "Coevaluación",
                "ONLINETEST": "Prueba en línea"
            }
        },
        endpoints: {
            graphql: {
                development: "http://localhost:4000/graphql",
                production: "https://backendrepo-w6bs.onrender.com/graphql"
            }
        }
    };

    // 2. Leer definiciones personalizadas si existen
    let customDictionary = {};
    const customFilePath = path.join(__dirname, 'dictionary-custom.json');

    if (fs.existsSync(customFilePath)) {
        try {
            customDictionary = JSON.parse(fs.readFileSync(customFilePath, 'utf8'));
            console.log('✅ Definiciones personalizadas cargadas correctamente');
        } catch (e) {
            console.error('❌ Error leyendo definiciones personalizadas:', e);
            customDictionary = { customModels: {}, customConstants: {} };
        }
    } else {
        console.log('ℹ️ No se encontró archivo de definiciones personalizadas');
        customDictionary = { customModels: {}, customConstants: {} };
    }

    // 3. Mezclar ambos diccionarios
    const finalDictionary = structuredClone(autoDictionary);

    // Aplicar descripciones personalizadas sobre modelos
    for (const modelName in customDictionary.customModels) {
        const customModel = customDictionary.customModels[modelName];

        // Buscar en qué categoría está el modelo
        for (const category in finalDictionary.models) {
            if (finalDictionary.models[category][modelName]) {
                // Sobrescribir descripción si existe
                if (customModel.description) {
                    finalDictionary.models[category][modelName].description = customModel.description;
                }

                // Sobrescribir propiedades específicas
                if (customModel.properties) {
                    for (const propName in customModel.properties) {
                        finalDictionary.models[category][modelName].properties[propName] =
                            customModel.properties[propName];
                    }
                }

                // Añadir notas si existen
                if (customModel.notes) {
                    finalDictionary.models[category][modelName].notes = customModel.notes;
                }
            }
        }
    }

    // Añadir constantes personalizadas
    for (const constName in customDictionary.customConstants) {
        finalDictionary.constants[constName] = customDictionary.customConstants[constName];
    }

    // 4. Escribir el diccionario final
    fs.writeFileSync(
        path.join(__dirname, 'vivecolegios-dictionary.json'),
        JSON.stringify(finalDictionary, null, 2)
    );

    console.log('✅ Diccionario JSON mixto generado con éxito');
};

// Ejecutar
generateMixedDictionary();