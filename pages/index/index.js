import {withRouter} from 'next/router';
import styles from './styles.scss';
import Layout from '../../components/Layout';
import Editor from '../../components/Editor';

export default withRouter(({router: {query: {userId, roomId = 'public'}}}) => {
  return (
    <Layout>
      currently in room id: {roomId}
      <br />
      current user id: {userId}
      <Editor roomId={roomId} userId={userId} />
    </Layout>
  );
});
