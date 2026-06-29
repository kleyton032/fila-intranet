import React from "react";
import PropTypes from "prop-types";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const FiltrosDashboard = (props) => {
  const { isExpanded, children } = props;

  return (
    <Collapse in={isExpanded} timeout="auto">
      <Box mb={2}>
        <Card>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </Box>
    </Collapse>
  );
};

FiltrosDashboard.propType = {
  isExpanded: PropTypes.bool.isRequired,
  childre: PropTypes.node,
};

export default FiltrosDashboard;
