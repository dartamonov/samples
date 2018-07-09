import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Loader from 'react-loader-advanced';
import { Col, Row } from '../components/Grid';
import ChannelAccordion from '../components/Video/ChannelAccordion.jsx';
import Cart from '../components/Cart/Cart.jsx';
import { loadContent, toggleAccordion, updateChannelSelection } from '../redux/video/actions';
import { normalizeContent } from '../redux/video/helpers';

export class VideoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
    };
  }

  componentWillMount() {
    const {loadContent} = this.props;

    loadContent();
  }

  handleContinue() {
    const {
      content
    } = this.props;

    if (!content.cart.monthlyTotal) {
      this.setState( //eslint-disable-line react/no-set-state
        {
          errors: {
            noOptionSelected: "Please, select a channel"
          }
        }
      );
      window.scroll(0, 0);
      return false;
    }

    this.props.history.push('/review');
  }

  render() {
    const {
      content,
      toggleAccordionAction,
      updateChannelSelectionAction
    } = this.props;

    return (
      <Loader show={_.isEmpty(content.channelGroups)} message={'Loading...'}>
        <div className="hg-page-container">
          <div className="container">
            <form noValidate>
              <Row>
                <Col lg={8} xs={12}>
                  <h1 tabIndex="-1" className="x-heading1">Video Channels</h1>
                  {
                    content.channelGroups.map((channelGroup, index) => {
                      return (
                        <Row key={index}>
                          <Col xs={12}>
                            <ChannelAccordion
                              channelGroup={channelGroup}
                              accordion={index !== 0}
                              updateChannelSelectionAction={updateChannelSelectionAction}
                              toggleAccordionAction={toggleAccordionAction}
                            />
                          </Col>
                        </Row>
                      );
                    })
                  }
              </Col>
              <Col className="sidebar sidebar--fixed" lg={4} xs={12}>
                <Cart cart={content.cart} continueAction={this.handleContinue.bind(this)}/>
              </Col>
            </Row>
            </form>
          </div>
        </div>
      </Loader>
    );
  }
}

VideoPage.propTypes = {
  content: PropTypes.object.isRequired,
  loadContent: PropTypes.func.isRequired,
  toggleAccordionAction: PropTypes.func.isRequired,
  updateChannelSelectionAction: PropTypes.func.isRequired,
  history: PropTypes.object
};

function mapStateToProps(state) {
  return {
    content: normalizeContent(state)
  };
}
function mapDispatchToProps(dispatch) {
  return {
    loadContent: bindActionCreators(loadContent, dispatch),
    toggleAccordionAction: bindActionCreators(toggleAccordion, dispatch),
    updateChannelSelectionAction: bindActionCreators(updateChannelSelection, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoPage);
