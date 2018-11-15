import React from 'react';

export default class Editor extends React.Component {
  editor;
  channel;

  async componentDidMount() {
    const {default: quill} = await import('quill');
    this.editor = new quill('.editor', {
      theme: 'snow',
    });

    this.editor.on('text-change', this.broadcastTextChange);

    this.bindToChannel();
  }

  bindToChannel = () => {
    const {roomId} = this.props;
    const ably = new Ably.Realtime('xVLyHw.FF_NXg:PwEmSWcMKGZ-jIJq');

    // TODO, bind this to the query param for the channel to be unique
    this.channel = ably.channels.get(`editor:${roomId}`);

    this.channel.subscribe('client-edit', this.handleEditEvent);
  };

  handleEditEvent = ({data}) => {
    const {
      payload: {fromUser, position, character},
    } = data;

    if (this.props.userId === fromUser) {
      return;
    }

    this.editor.insertText(position, character, 'api');
  };

  broadcastTextChange = (delta, oldDelta, source) => {
    if (source === 'api') {
      return;
    }

    const {ops} = delta;
    const [meta, payload] = ops;
    const position = payload ? meta.retain : 0;
    const character = payload ? payload.insert : meta.insert;
    const event = {
      type: 'insert character',
      payload: {
        fromUser: this.props.userId,
        position,
        character,
      },
    };

    try {
      this.channel.publish('client-edit', event);
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    return (
      <div>
        <div className={'editor'} />
      </div>
    );
  }
}
