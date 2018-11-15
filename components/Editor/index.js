import React from 'react';
import {throttle} from 'lodash';

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
    const ably = new Ably.Realtime('xVLyHw.FF_NXg:PwEmSWcMKGZ-jIJq');

    // TODO, bind this to the query param for the channel to be unique
    this.channel = ably.channels.get('editor:1');

    this.channel.subscribe('client-edit', this.handleEditEvent);
  };

  handleEditEvent = throttle(({data}) => {
    this.editor.setContents(data);
  }, 2000);

  broadcastTextChange = (delta, oldDelta, source) => {
    const contents = this.editor.getContents();

    try {
      this.channel.publish('client-edit', contents);
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    return <div className={'editor'} />;
  }
}
