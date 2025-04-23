import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Collapse, Row } from 'reactstrap';
import { Colxx } from '../../common/CustomBootstrap';
import faqData from '../data/faq';

const Faq = () => {
  const [showingIndex, setShowIndex] = useState(0);
  return (
    <>
      <Row>
        <Colxx xxs="12" className="mb-4">
          <>
            {faqData.map((item, index) => {
              return (
                <Card className="d-flex mb-3" key={`faqItem_${index}`}>
                  <div className="d-flex flex-grow-1 min-width-zero">
                    <Button
                      color="link"
                      className="card-body  btn-empty btn-link list-item-heading text-left text-one"
                      onClick={() => setShowIndex(index)}
                      aria-expanded={showingIndex === index}
                    >
                      {item.question}
                    </Button>
                  </div>
                  <Collapse isOpen={showingIndex === index}>
                    <div
                      className="card-body accordion-content pt-0"
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  </Collapse>
                </Card>
              );
            })}
          </>
        </Colxx>
      </Row>
    </>
  );
};

const mapDispatchToProps = {};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Faq);
