import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Switch, Route, NavLink, useHistory, Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Striver from "./Striver";
import Home from "./Home";
import StriverMainPage from "./StriverMainPage";
import LoginAdmin from "./LoginAdmin";
import AdminDashboard from "./AdminDashboard";
import PrivateRoute from "./PrivateRoute";
import { useContext } from "react";
import AuthContext from "../context/auth-context";
import LoveBabbar from "./LoveBabbar";
import { fb } from "../service/firebase";

function App() {
  const ctx = useContext(AuthContext);
  // useEffect(() => {
  //   const unsubsribe = fb.auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       setAuthUser(user);
  //     } else {
  //       setAuthUser(null);
  //     }
  //   });
  //   return unsubsribe;
  // }, [])
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Coding Solutions</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink className="link-dark mt-2 text-decoration-none" to="/">
                Home
              </NavLink>

              <NavLink
                className="link-dark mt-2 text-decoration-none mx-3"
                to="/striver"
              >
                Striver Sheet
              </NavLink>
              <NavLink
                className="link-dark mt-2 text-decoration-none mx-3"
                to="/loveBabbar"
              >
                Love Babbar Sheet
              </NavLink>
              <NavLink
                className="link-dark mt-2 text-decoration-none mx-3"
                to="/adminDashboard"
              >
                Admin Dashboard
              </NavLink>
            </Nav>
            <Nav>
              <Link to="/login">
                <Button>Login as Admin</Button>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Switch>
        <Route exact path="/">
          <Home></Home>
        </Route>
        <Route path="/login">
          {" "}
          <LoginAdmin></LoginAdmin>{" "}
        </Route>
        <PrivateRoute
          exact
          path="/adminDashboard"
          component={AdminDashboard}
        ></PrivateRoute>
        <PrivateRoute
          path="/adminDashBoard/:tableName"
          component={AdminDashboard}
        ></PrivateRoute>
        <Route exact path="/loveBabbar">
          {" "}
          <LoveBabbar></LoveBabbar>{" "}
        </Route>
        <Route exact path="/striver">
          <Striver></Striver>
        </Route>
        <Route path="/striver/:dayValue">
          <Striver></Striver>
        </Route>
      </Switch>
    </>
  );
}

export default App;
