import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import "./Menu.css"

const Menu = () => (
  <div className="menu-wrapper">
    <List>
      <ListItem disablePadding>
        <ListItemButton selected={true}>
          <ListItemText primary="Survey List" />
        </ListItemButton>
      </ListItem>
      {/* <ListItem disablePadding>
        <ListItemButton>
          <ListItemText primary="Drafts" />
        </ListItemButton>
      </ListItem> */}
    </List>
  </div>
)

export default Menu
