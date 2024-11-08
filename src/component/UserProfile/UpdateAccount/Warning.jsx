import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function AlertDismissible() {
  const [show, setShow] = useState(true);

  return (
    <>
      <Alert show={show} variant="warning">
        <Alert.Heading>Pay Attention</Alert.Heading>
        <p>
        If you accidentally delete any filed of information, press CTRL Z to restore!!
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => setShow(false)} variant="outline-success">
            Close me
          </Button>
        </div>
      </Alert>

      {!show && <Button onClick={() => setShow(true)}>Pay Attention!!</Button>}
    </>
  );
}

export default AlertDismissible;