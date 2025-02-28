import { useState, useEffect } from 'react';
import { Navbar, Container, Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

// Интерфейс для пользователя
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', email: '' });

  // Загрузка данных с API
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Ошибка загрузки данных:', error));
  }, []);



  
  // Добавление нового пользователя
  const handleAddUser = async () => {
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/users', newUser);
      setUsers([...users, response.data]);
      setShowModal(false);
      setNewUser({ name: '', username: '', email: '' });
    } catch (error) {
      console.error('Ошибка добавления пользователя:', error);
    }
  };

  return (
    <div>
      {/* Навигационная панель */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">User Manager</Navbar.Brand>
        </Container>
      </Navbar>

      {/* Основной контент */}
      <Container className="my-5">
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Добавить пользователя
        </Button>

        {/* Таблица пользователей */}
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Логин</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      {/* Модальное окно для добавления пользователя */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить пользователя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Логин</Form.Label>
              <Form.Control
                type="text"
                value={newUser.username}
onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleAddUser}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;

