import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import { spacing } from "@material-ui/system";
import { Card as MuiCard } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

const Card = styled(MuiCard)(spacing);

const useStyles = makeStyles((theme) => ({
  root: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  },
}));

const TabPanel = (props) => {
  const classes = useStyles();
  const { id, tabs, selected, children } = props;
  const [tab, setTab] = useState(selected);

  const changeTab = (event, newValue) => {
    setTab(newValue);
  };

  const a11yProps = (index) => {
    return {
      id: `${id}-aba-${index}`,
      "aria-controls": `${id}-aba-${index}`,
    };
  };
  return (
    <React.Fragment>
      <Card>
        <Tabs
          value={tab}
          onChange={changeTab}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="TabPanel Tab"
          className={classes.root}
        >
          {tabs.map((value, index) => (
            <Tab key={index} label={value.label} {...a11yProps(index)}></Tab>
          ))}
        </Tabs>
      </Card>

      <Box mt={2}>
        {children}

        {tabs.map((value, index) => {
          let tabContent = null;
          if (tab === index) {
            tabContent = (
              <React.Fragment key={index}>{value.component}</React.Fragment>
            );
          }

          return tabContent;
        })}
      </Box>
    </React.Fragment>
  );
};

TabPanel.propTypes = {
  id: PropTypes.string.isRequired,
  tabs: PropTypes.array.isRequired,
  selected: PropTypes.number.isRequired,
  children: PropTypes.node,
};

export default TabPanel;
