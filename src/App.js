import { Row, Col } from "antd";
import "./App.css";
import RichTextEditor from "./component/TeacherDashboardView/RichTextEditor/RichTextEditor";

const App = () => {
  return (
    <>
      <Row style={{ marginTop: "6rem" }}>
        <Col span={8}></Col>
        <Col span={8}>
          <RichTextEditor />
        </Col>
        <Col span={8}></Col>
      </Row>
    </>
  );
};

export default App;
