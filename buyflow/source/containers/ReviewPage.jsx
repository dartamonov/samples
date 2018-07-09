import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Col, Row } from '../components/Grid';
import ChannelOption from '../components/Video/ChannelOption.jsx';
import Price from '../components/Price/Price.jsx';

export class ReviewPage extends Component {
  render() {
    const {
      content,
      cart
    } = this.props;
    const { channelGroups } = content;

    return (
        <div className="hg-page-container">
          <div className="container">
            {!cart.monthlyTotal
              ? <Row>
                  <Col lg={12}>
                    <h1 tabIndex="-1" className="x-heading1">Your cart is empty. Please, pick some channels.</h1>
                    <a className="x-button--solid" href="/video">Video Channels</a>
                  </Col>
                </Row>
              : <Row>
                  <Col lg={12}>
                    <h1 tabIndex="-1" className="x-heading1">Review Your Selection</h1>
                    <p><a className="x-button--solid" href="/video">Update Selection</a></p>
                    <h4>Your monthly total: <Price price={cart.monthlyTotal}/></h4>
                    <h4>Your channels:</h4>
                    <Row>
                    {
                      _.map(channelGroups, (channelGroup) => {
                        return channelGroup.channels.map((option, index) => {
                          return option.isSelected
                            ? <Col className="margin-top12" md={4} xs={12} key={index}>
                              <ChannelOption
                                index={index}
                                option={option}
                                channelGroup={channelGroup}
                              />
                            </Col>
                           : null;
                        });
                      })
                    }
                    </Row>
                </Col>
              </Row>
            }
          </div>
        </div>
    );
  }
}

ReviewPage.propTypes = {
  content: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    ...state.video
  };
}

export default connect(
  mapStateToProps,
  null
)(ReviewPage);
