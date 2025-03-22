import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material"
import "./Menu.css"
import { Link } from "react-router-dom";

const Menu = () => (
  <div className="menu-wrapper">
    <List>
      <ListItem disablePadding>
        <Link to="/surveyList" style={{ width: '100%', textDecoration: "none" }}>
          <ListItemButton>
            <ListItemText primary="Survey List" />
          </ListItemButton>
        </Link>
      </ListItem>
    </List>
  </div>
)

export default Menu
