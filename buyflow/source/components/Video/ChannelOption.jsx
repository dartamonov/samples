import React, { PropTypes, Component } from 'react';
import Price from '../Price/Price.jsx';

export class ChannelOption extends Component {
  handleChange(id, e) {
    const remove = !!e.target.checked;

    e.preventDefault();
    const {
      updateChannelSelectionAction,
      channelGroup,
    } = this.props;

    updateChannelSelectionAction(channelGroup.channelType, id, remove);

  }

  render() {
    const {
      option,
      updateChannelSelectionAction
    } = this.props;
    const panelStyles = {
      backgroundImage: `url(${option.backgroundImageUrl})`
    };

    return (
      <div className="customize-channel-panel" style={panelStyles}>
        <div className="customize-channel-panel__content">
          <div className="customize-channel-panel__content--top">
            <span className="helper"/>
            <img src={`${option.logoUrl}`} alt={`${option.name} Logo`}/>
          </div>
          <div className="customize-channel-panel__content--bottom">
            <p>
              <span className="x-body3">{option.description}</span>
            </p>
          </div>
        </div>
        <div className="customize-channel-panel__input">
          <div className="x-field--checkbox">
              <div>
                {updateChannelSelectionAction && <input
                  className="x-checkbox vh"
                  name={option.id}
                  type="checkbox"
                  id={option.id}
                  checked={option.isSelected}
                  value={option.id}
                  ref={option.id}
                  disabled={option.isIncluded}
                  onChange={option.isIncluded ? () => {} : this.handleChange.bind(this, option.id)}
                />}
                <label htmlFor={option.id} className="x-checkbox-label x-body2">
                  <span className="vh">{option.name} </span>
                  <Price price={option.price}/>
                </label>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

ChannelOption.propTypes = {
  option: PropTypes.object,
  channelGroup: PropTypes.object,
  updateChannelSelectionAction: PropTypes.func
};

export default ChannelOption;
