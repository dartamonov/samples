import React, { PropTypes, Component } from 'react';
import { Row, Col } from '../Grid';
import Accordion from '../Accordion/Accordion.jsx';
import ChannelOption from './ChannelOption.jsx';

class ChannelAccordion extends Component {

  handleAccordionClick(expanded) {
    const {
      toggleAccordionAction,
      channelGroup
    } = this.props;

    toggleAccordionAction(channelGroup.channelType, !expanded);
  }

  render() {
    const {
      channelGroup,
      updateChannelSelectionAction,
      accordion
    } = this.props;

    return (
      <Accordion active={channelGroup.expanded || !accordion}>
        {accordion ? <div className="hg-panel hg-panel--action-right-at-768 accordion__title">
          <div className="hg-panel__content">
            <div className="hgroup">
              <h3>{channelGroup.title}</h3>
            </div>
          </div>
          <div className="hg-panel__action">
            <button data-tracking={{}} type="button" onClick={this.handleAccordionClick.bind(this, channelGroup.expanded)} className="x-body3 x-button--text accordion__trigger" aria-expanded={`${channelGroup.expanded}`}>
              {!channelGroup.expanded
                ? <span>Show Channels</span>
                : <span>Hide Channels</span>
              }
            </button>
          </div>
        </div> : null}
        <div className="accordion__body accordion__body--no-panel margin-top24">
          {!accordion &&
            <h3 className="x-heading1">{channelGroup.title}</h3>
          }
          <Row>
            {channelGroup.channels.map((option, index) => {
                return (
                  <Col className="margin-top12" md={6} xs={12} key={index}>
                    <ChannelOption
                      index={index}
                      option={option}
                      channelGroup={channelGroup}
                      updateChannelSelectionAction={updateChannelSelectionAction}
                    />
                  </Col>
                );
              })
            }
          </Row>
        </div>
      </Accordion>
    );
  }
}

ChannelAccordion.propTypes = {
  channelGroup: PropTypes.object,
  accordion: PropTypes.boolean,
  updateChannelSelectionAction: PropTypes.func,
  toggleAccordionAction: PropTypes.func
};

export default ChannelAccordion;
