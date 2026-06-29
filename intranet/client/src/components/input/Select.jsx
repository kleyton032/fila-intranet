import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { List } from "react-virtualized";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const { children, role, ...other } = props;
  const itemCount = Array.isArray(children) ? children.length : 0;
  const itemSize = 36;

  return (
    <div ref={ref}>
      <div {...other}>
        <List
          height={250}
          width={1}
          rowHeight={itemSize}
          overscanCount={5}
          rowCount={itemCount}
          containerStyle={{
            width: "100%",
            maxWidth: "100%",
          }}
          style={{
            width: "100%",
          }}
          rowRenderer={(props) => {
            return React.cloneElement(children[props.index], {
              style: props.style,
            });
          }}
          role={role}
        />
      </div>
    </div>
  );
});

export default function VirtualizedAutocomplete(props) {
  const {
    id,
    onOpen,
    onChange,
    options,
    label,
    title,
    multiple,
    limitTags,
  } = props;
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  return (
    <Autocomplete
      id={id}
      loading
      multiple={multiple || false}
      disableCloseOnSelect={multiple || false}
      limitTags={limitTags || 3}
      onOpen={onOpen}
      onChange={onChange}
      disableListWrap
      ListboxComponent={ListboxComponent}
      options={options}
      getOptionLabel={
        Array.isArray(label)
          ? (option) => `${option[label[0]]} - ${option[label[1]]}`
          : (option) => option[label]
      }
      renderOption={(option, { selected }) => (
        <React.Fragment>
          {multiple ? (
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
          ) : (
            ""
          )}
          {Array.isArray(label)
            ? `${option[label[0]]} - ${option[label[1]]}`
            : option[label]}
        </React.Fragment>
      )}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label={title} fullWidth />
      )}
    />
  );
}
