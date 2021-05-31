import { Row, Col } from 'antd';
import './App.css';
import RichTextEditor from './component/TeacherDashboardView/RichTextEditor/RichTextEditor';

const App = () => {
  return (
    <>
      <Row style={{ marginTop: '6rem' }}>
        <Col span={6}></Col>
        <Col span={12}>
          <RichTextEditor />
        </Col>
        <Col span={6}></Col>
      </Row>
    </>
  );
};

export default App;
