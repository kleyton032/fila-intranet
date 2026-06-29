import React from "react";
import PropTypes from "prop-types";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const InfoDashboard = (props) => {
  const { expanded, responsavel, conceito, ultimaAlteracao, children } = props;

  return (
    <Collapse in={expanded} timeout="auto">
      <Box mb={2}>
        <Card>
          <CardContent>
            <div>
              <b>Responsável: </b> {responsavel}
            </div>
            <div>
              <b>Conceito: </b>
              {conceito}
            </div>
            <div>
              <b>Histórico:</b>
              {ultimaAlteracao}
            </div>
            {children}
          </CardContent>
        </Card>
      </Box>
    </Collapse>
  );
};

InfoDashboard.propTypes = {
  expanded: PropTypes.bool.isRequired,
  responsavel: PropTypes.string.isRequired,
  conceito: PropTypes.string.isRequired,
  ultimaAlteracao: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default InfoDashboard;
