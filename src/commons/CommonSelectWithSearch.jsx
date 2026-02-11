import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Switch } from "@mui/material";

const styles = () => ({
  // Your MUI styles here
});

function CommonSelectWithSearch(props) {
  const {
    options = [],
    inputFieldProps,
    values,
    leftSideLabel,
    triggerOnBlurOnSelect = false,
    formikProps = {},
    sqlQueries = false,
    defaultValue,
    value = "",
    variant = "standard",
  } = props;
  const { setFieldValue = () => {} } = formikProps;
  const {
    name,
    label,
    error,
    helperText,
    fullWidth,
    onChange = () => {},
    inputProps = {},
    required,
    disabled,
    edit,
    onBlur,
  } = inputFieldProps;

  //check Filed has exclude and include
  const hasIncludeExcludeSelection = Object.keys(sqlQueries).length;

  //Update Formik Field Value
  const updateInitalValueAfterOptionLoad = (val) => {
    return options?.find((opt) => "" + opt.value === "" + val) || null;
  };

  //Update Formkik Field Value
  const updateFormikValue = (selectedValue) => {
    onChange({
      target: {
        name: name,
        value: selectedValue,
      },
    });
  };

  const defaultProps = {
    options: options,
    isOptionEqualToValue: (option, value) => {
      if (!option || !value) return false;
      return option.value === value.value;
    },
    getOptionLabel: (option) => option.label,
    isOptionDisabled: (option) => !!option.disabled === true,
    renderOption: (props, option) => (
      <li
        {...props}
        key={option.value}
        style={{ opacity: option.disabled ? 0.5 : 1 }}
        {...(option.disabled
          ? {
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
              },
            }
          : {})}
      >
        {option.label}
      </li>
    ),
  };

  const [localValue, setValue] = React.useState(
    updateInitalValueAfterOptionLoad(value),
  );

  //For Label Sql Queries Selection
  const [includeSelected, setIncludeSelected] = React.useState(
    values?.[`${name}-isIncluded`],
  );
  useEffect(() => {
    if (hasIncludeExcludeSelection) {
      setFieldValue(`${name}-isIncluded`, includeSelected);
    }
  }, [includeSelected]);
  //For Label Sql Queries Selection

  // update When option from api
  useEffect(() => {
    setValue(updateInitalValueAfterOptionLoad(value));
  }, [options]);

  //default Value Assignment
  useEffect(() => {
    if (
      value === "" &&
      defaultValue &&
      localValue?.value !==
        updateInitalValueAfterOptionLoad(defaultValue)?.value
    ) {
      updateFormikValue(updateInitalValueAfterOptionLoad(defaultValue)?.value);
    } else if (value === "" && localValue?.value) {
      setValue(updateInitalValueAfterOptionLoad(value));
    } else if (value !== localValue?.value) {
      setValue(updateInitalValueAfterOptionLoad(value));
    }
  }, [localValue, value]);

  return (
    <>
      <Autocomplete
        {...defaultProps}
        id={name}
        fullWidth
        name={name}
        onBlur={onBlur}
        value={localValue}
        onChange={(event, newValue) => {
          updateFormikValue(newValue?.value);
          setValue(newValue);
          if (onBlur && triggerOnBlurOnSelect) {
            onBlur({
              target: {
                name: name,
                value: newValue?.value,
              },
            });
          }
        }}
        componentsProps={{
          paper: {
            variant: "menuItemPaper2",
          },
        }}
        sx={
          hasIncludeExcludeSelection
            ? {
                "& >.MuiFormControl-root": {
                  "& >.MuiInput-root.MuiInputBase-root": {
                    marginTop: "20px",
                  },
                },
              }
            : {
                "& >.MuiFormControl-root": {
                  "& >.MuiInput-root.MuiInputBase-root": {
                    marginTop: leftSideLabel ? "0px" : "20px",
                  },
                },
              }
        }
        clearOnBlur
        disabled={disabled}
        defaultValue={updateInitalValueAfterOptionLoad(defaultValue)}
        //popupIcon={edit || !disabled ? <CommonSVG name="expandMore" /> : null}
        renderInput={(params) => (
          <TextField
            variant={variant}
            {...params}
            InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
            multiline={edit || !disabled ? false : true}
            InputProps={{
              ...params.InputProps,
              ...inputProps,
            }}
            label={
              hasIncludeExcludeSelection ? (
                <>
                  {label}
                  <Switch
                    size="small"
                    checked={includeSelected}
                    onChange={() => setIncludeSelected(!includeSelected)}
                    color="primary"
                    name="includeSelected"
                    inputProps={{ "aria-label": "include selected options" }}
                  />
                </>
              ) : (
                label
              )
            }
            {...{
              name,
              error,
              helperText,
              fullWidth,
              required,
              disabled,
            }}
          />
        )}
      />
    </>
  );
}

export default CommonSelectWithSearch;
