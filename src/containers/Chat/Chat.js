import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
const filter = require('profanity-filter');

filter.addWord('potato');
filter.addWord('REA');
filter.addWord('carbs');
filter.addWord('real estate agent');
filter.addWord('/me pats kitty', '* Robbie pats kitty');

@connect(
  state => ({user: state.auth.user})
)
export default class Chat extends Component {

  static propTypes = {
    user: PropTypes.object
  };

  state = {
    message: '',
    messages: []
  };

  componentDidMount() {
    if (socket) {
      socket.on('msg', this.onMessageReceived);
      setTimeout(() => {
        socket.emit('history', {offset: 0, length: 100});
      }, 100);
    }
  }

  componentWillUnmount() {
    if (socket) {
      socket.removeListener('msg', this.onMessageReceived);
    }
  }

  onMessageReceived = (data) => {
    const messages = this.state.messages;
    messages.push(data);
    this.setState({messages});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const replacementMethod = this.state.message[0] === '/' ? 'word' : 'grawlix';
    filter.setReplacementMethod(replacementMethod);
    const msg = filter.clean(this.state.message);
    this.setState({message: ''});

    socket.emit('msg', {
      from: this.props.user.name,
      text: msg
    });
  }

  render() {
    const style = require('./Chat.scss');
    const {user} = this.props;
    return (
      <div className={style.chat + ' container'} >
        <h1 className={style}>Chat</h1>

        {user &&
        <div>
          {this.state.messages.map((msg) => {
            //console.log('User :' + user.name);
            //console.log('Id :' + msg.from);
            var chatStyle = (user.name == msg.from)? style.me : style.them;
            return <div className={style.chatContainer}>
            <div className={chatStyle} key={`chat.msg.${msg.id}`}>
            <span>☺ {msg.from.toUpperCase()}</span>
            <p> {msg.text}</p>
            </div>
            </div>;
          })}
          <div className="navbar navbar-default navbar-fixed-bottom">
          <form className="login-form" onSubmit={this.handleSubmit}>
             <input type="text" ref="message" placeholder="Enter your message"
             value={this.state.message}java
             onChange={(event) => {
               this.setState({message: event.target.value});
             }
            }/>
            <button className="btn" onClick={this.handleSubmit}>SEND</button>
          </form>
          </div>
        </div>
        }
      </div>
    );
  }
}
