import React, { useEffect, useState, useMemo, useRef } from "react";
import { styled } from "@mui/material/styles";
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import Button from "@mui/material/Button";
import { Formik } from "formik";
import Divider from "@mui/material/Divider";
import * as Yup from "yup";
import {
  Grid,
  IconButton,
  Tooltip,
  ClickAwayListener,
  Switch,
} from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import { isEqual as _isEqual } from "lodash";
import dayjs from "dayjs";
import { Field } from "formik";
import { CheckboxWithLabel } from "formik-mui";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { MenuItem, TextField, Typography } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import AdapterMoment from "@mui/lab/AdapterMoment";
import moment from "moment";
import AppLoader from "./AppLoader";
import CommonSelectWithSearch from "./CommonSelectWithSearch";
import constants from "../constants/constants";
import "../App.css";

const blankSpaceRegex = new RegExp(/\S/);
const validationSchema = (schema) => {
  let validation = {};
  schema.forEach((item) => {
    const { disabled } = item;
    if (_get(item, "required", false) && !item?.isDependent) {
      let tempValidationSchema = Yup.string()
        .required(`${item.label} is required`)
        .matches(
          blankSpaceRegex,
          "* This field cannot contain only blankspaces",
        );

      if (item.minChar) {
        tempValidationSchema = tempValidationSchema.min(
          item.minChar,
          "Text must be at least " + item.minChar + " characters",
        );
      }
      if (item.maxChar) {
        tempValidationSchema = tempValidationSchema.max(
          item.maxChar,
          "Text must not exceed " + item.maxChar + " characters",
        );
      }
      validation[item.name] = tempValidationSchema.test(
        `${item.name} validation`,
        `Invalid ${item.label}`,
        (value) => {
          const regex =
            item?.regex ||
            constants?.dynamicRegex()?.[item?.name] ||
            constants?.regex?.[item.name];
          if (regex && !disabled) {
            return regex.test(value);
          }
          return true;
        },
      );
    } else {
      let tempValidationSchema = Yup.string().matches(
        blankSpaceRegex,
        "* This field cannot contain only blankspaces",
      );
      if (item.minChar) {
        tempValidationSchema = tempValidationSchema.min(
          item.minChar,
          "Text must be at least 5 characters",
        );
      }
      if (item.maxChar) {
        tempValidationSchema = tempValidationSchema.max(
          item.maxChar,
          "Text must not exceed 20 characters",
        );
      }
      validation[item.name] = tempValidationSchema.test(
        `${item.name} validation`,
        `Invalid ${item.label}`,
        (value) => {
          const regex =
            item?.regex ||
            constants?.dynamicRegex()?.[item?.name] ||
            constants?.regex?.[item.name];
          if (regex && value && !disabled) {
            return regex.test(value);
          }
          return true;
        },
      );
    }
  });
  return validation;
};

const getInitalValues = (schema, initialValues = {}) => {
  let values = {};
  schema.forEach((item) => {
    values[item.name] =
      _get(initialValues, item.name, "") || _get(item, "defaultValue", "");
  });
  return values;
};

const RenderFields = (props) => {
  const {
    values,
    name,
    errors,
    isSubmitting,
    extraInfo,
    edit,
    operationType,
    disabled,
    options,
    error,
    isTouched,
    required,
    onUpdate2 = () => {},
    inputProps = {},
  } = props;
  const [selectOptions, setOptions] = useState(false);
  const [localInputProps, setInputProps] = useState({});

  const updateInputProps = (arg) => {
    setInputProps((pre) => ({ ...pre, ...arg }));
  };

  const [loader, setLoader] = useState(false);
  const reRenderField = () => {
    setLoader(true);

    setTimeout(() => {
      setLoader(false);
    }, 0);
  };
  useEffect(() => {
    // Support multiple dependencies separated by '|'
    if (extraInfo?.isDependent && extraInfo?.onDependent) {
      const dependentFields = extraInfo.onDependent
        .split("|")
        .map((f) => f.trim());
      const hasValues =
        Object.keys(values).length &&
        dependentFields.some(
          (dep) => values?.[dep] !== "" && values?.[dep] !== undefined,
        );

      if (hasValues) {
        extraInfo?.options &&
          extraInfo.options(
            { ...props, operationType },
            setOptions,
            setLoader,
            updateInputProps,
          );
        extraInfo?.onDependentFieldChange &&
          extraInfo.onDependentFieldChange(
            { ...props, operationType },
            setOptions,
            setLoader,
            updateInputProps,
          );
      }
    }
    // eslint-disable-next-line
  }, [
    extraInfo?.isDependent,
    extraInfo?.onDependent,
    ...(extraInfo?.onDependent || "").split("|").map((dep) => values?.[dep]),
  ]);

  useEffect(() => {
    if (!extraInfo?.isDependent) {
      extraInfo?.options &&
        extraInfo?.options(
          { ...props, operationType },
          setOptions,
          setLoader,
          updateInputProps,
        );
      extraInfo?.onDependentFieldChange &&
        extraInfo?.onDependentFieldChange(
          { ...props, operationType },
          setOptions,
          setLoader,
          updateInputProps,
        );
    }
  }, []);

  return useMemo(
    () => (
      <FormFields
        {...props}
        reRenderField={reRenderField}
        selectOptions={selectOptions}
        loader={loader}
        inputProps={{
          ...inputProps,
          ...localInputProps,
        }}
      />
    ),
    [
      values[name],
      errors[name],
      isSubmitting,
      selectOptions,
      options,
      edit,
      loader,
      disabled,
      isTouched,
      required,
      localInputProps,
    ],
  );
};

const LeftLabelTextField = ({
  label = "",
  children,
  required,
  edit,
  labelColumnWidth,
  type,
  tooltip = false,
  tooltipText = "",
}) => {
  const [open, setOpen] = useState(false);
  const textFieldStyles = {
    display: "flex",
    alignItems: "center",
  };

  const labelStyles = {
    marginRight: "10px", // Adjust this value as needed
    minWidth: labelColumnWidth || "170px",
    whiteSpace: "nowrap",
    color: "#777777", // Adjust this value as needed
  };
  return type !== "hidden" ? (
    <div style={textFieldStyles}>
      {tooltip && (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Tooltip
            PopperProps={{
              disablePortal: true,
            }}
            onClose={() => setOpen(false)}
            open={open}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title={tooltipText}
            arrow
            placement="top"
          >
            <IconButton
              className={"leftLabelIconBtn"}
              onClick={() => setOpen(true)}
            >
              <CommonSVG name="InfoIcon" />
            </IconButton>
          </Tooltip>
        </ClickAwayListener>
      )}
      <label style={labelStyles}>
        {label} {label && ` : `}
        {required && label && edit ? (
          <span style={{ color: "red" }}>*</span>
        ) : (
          ""
        )}
      </label>
      {children}
    </div>
  ) : null;
};

const FormFields = (props) => {
  const {
    name,
    label,
    type,
    options = [],
    value,
    error,
    order,
    // isSubmitting,
    isTouched,
    // values,
    // errors,
    // touched,
    handleChange,
    handleBlur,
    placeholder = false,
    // handleSubmit,
    // isSubmitting,
    setFieldValue,

    index,
    column,
    edit,
    variant = "standard",
    disabled = false,
    width = false,
    required = false,
    isToWords = false,
    title = false,
    font = 3,
    titleVariant = "h3",
    CustomeComponent,
    hidden = false,
    smallFont = false,
    extraInfo = false,
    selectOptions = false,
    loader = false,
    inputProps = {},
    leftSideLabel,
    showMiniLabel = true,
    labelColumnWidth = false,
    inlineStyle = {},
    generateGridStyle = () => {},
    gridLayout = {},
    tooltip = false,
    tooltipText = "",
    size,
    singleSelect = false,
    onUpdate2 = () => {},
    formikProps = {},
    setErrorOnField,
    custumStyleTitle = false,
    isDateDisable = false,
    reRenderField = () => {},
  } = props;

  const { setFieldTouched = () => {}, setFieldError = () => {} } = formikProps;
  const [open, setOpen] = useState(false);
  const isDate = edit && !disabled && constants.date.dateLabel.includes(name);

  const showDateWithDisabled =
    constants.date.dateLabel.includes(name) && (!edit || disabled);
  const getDateValue = (value) => {
    return dayjs(value).isValid() ? getDateFormateForTable(name, value) : value;
  };
  const localLang = localStorage.getItem(constants.LOCAL_STORAGE_LANG_KEY);
  useEffect(() => {
    moment.locale(localLang);
  }, [localLang]);

  useEffect(() => {
    onUpdate2({ name, value, setErrorOnField, extraFormikProps: props });
  }, [value]);

  if (type === "divider") {
    return (
      <Grid
        item
        xs={12}
        md={6}
        lg={6}
        style={{
          ...generateGridStyle({
            indexInfo: index,
            columnInfo: gridLayout?.gridTemplateColumns?.split(" ")?.length,
          }),
          ...inlineStyle,
        }}
        align="left"
        key={index}
        className={`${"orderStyle"} ${(smallFont && "smallFont") || ""}`}
      >
        {" "}
        <Divider />{" "}
      </Grid>
    );
  } else if (type === "component") {
    return (
      <Grid
        item
        xs={12}
        md={6}
        lg={6}
        style={{
          ...generateGridStyle({
            indexInfo: index,
            columnInfo: gridLayout?.gridTemplateColumns?.split(" ")?.length,
          }),
          ...inlineStyle,
        }}
        align="left"
        key={index}
        className={`${"orderStyle"} ${(smallFont && "smallFont") || ""}`}
      >
        {title && (
          <Typography
            fontWeight={"bold"}
            className={"fieldTitle"}
            variant={titleVariant}
          >
            {title}
          </Typography>
        )}
        <CustomeComponent
          title={label}
          {...props}
          typographyClass={{
            className: "fieldTitle",
            style: {
              fontSize: `${font * 8}px`,
            },
          }}
          inputFieldProps={{
            id: name,
            label: label,
            type: isDate ? "date" : type || "text",
            name: name,
            value: isDate
              ? dayjs(value).format(constants.date.DATE_FORMAT)
              : showDateWithDisabled
                ? getDateValue(value)
                : value,
            onChange: handleChange,
            onBlur: handleBlur,
            error: error && isTouched,
            helperText: error && isTouched ? error : "",
            fullWidth: true,
            disabled: disabled || !edit,
            InputLabelProps: { shrink: true },
            inputProps: inputProps,
            InputProps: {
              ...(((disabled || !edit) && { disableUnderline: true }) || {}),
              ...inputProps,
            },
          }}
        >
          <TextField
            variant={variant}
            id={name}
            label={label}
            sx={{
              "& >.MuiInput-root.MuiInputBase-root": {
                marginTop: "20px",
              },
            }}
            type={isDate ? "date" : "text"}
            name={name}
            value={value}
            required={required}
            multiline
            onChange={handleChange}
            onBlur={handleBlur}
            error={error && isTouched}
            helperText={error && isTouched ? error : ""}
            fullWidth
            disabled={disabled || !edit}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              ...(((disabled || !edit) && { disableUnderline: true }) || {}),
              endAdornment: (
                <InputAdornment>
                  <IconButton
                    type="submit"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </CustomeComponent>
      </Grid>
    );
  } else if (
    type === "select" ||
    (["multiSelect"].includes(type) && singleSelect)
  ) {
    return (
      <Grid
        item
        xs={12}
        md={6}
        lg={6}
        sx={{ width: width }}
        style={{
          ...generateGridStyle({
            indexInfo: index,
            columnInfo: gridLayout?.gridTemplateColumns?.split(" ")?.length,
          }),
          ...inlineStyle,
        }}
        align="left"
        className={`${"orderStyle"} ${(smallFont && "smallFont") || ""}`}
        key={index}
      >
        {title && (
          <Typography className={"fieldTitle"} variant={titleVariant}>
            {title}
          </Typography>
        )}
        {(leftSideLabel && (
          <LeftLabelTextField
            type={type}
            edit={edit}
            required={required}
            label={label}
            labelColumnWidth={labelColumnWidth}
            tooltip={tooltip}
            tooltipText={tooltipText}
          >
            <CommonSelectWithSearch
              {...props}
              options={selectOptions || options}
              inputFieldProps={{
                id: name,
                label: edit && !disabled && value === "" ? `Select` : "",

                name: name,
                onChange: handleChange,
                onBlur: handleBlur,
                error: error && isTouched,
                helperText: error && isTouched ? error : "",
                fullWidth: true,
                disabled: disabled || !edit || loader,

                InputLabelProps: { shrink: true },
                inputProps: inputProps,
                InputProps: {
                  ...(((disabled || !edit) && { disableUnderline: true }) ||
                    {}),
                  ...inputProps,
                },
              }}
            />
          </LeftLabelTextField>
        )) || (
          <CommonSelectWithSearch
            {...props}
            options={selectOptions || options}
            inputFieldProps={{
              id: name,
              label: label,
              required,
              name: name,
              onChange: handleChange,
              onBlur: handleBlur,
              error: error && isTouched,
              helperText: error && isTouched ? error : "",
              fullWidth: true,
              disabled: disabled || !edit || loader,

              InputLabelProps: { shrink: true },
              inputProps: inputProps,
              InputProps: {
                ...(((disabled || !edit) && { disableUnderline: true }) || {}),
                ...inputProps,
              },
            }}
          />
        )}
      </Grid>
    );
  } else if (["multiSelect"].includes(type)) {
    return (
      <Grid
        item
        xs={12}
        md={6}
        lg={6}
        align="left"
        className={`${"orderStyle"} ${(smallFont && "smallFont") || ""}`}
        key={index}
      >
        {title && (
          <Typography className={"fieldTitle"} variant={titleVariant}>
            {title}
          </Typography>
        )}
        {(leftSideLabel && (
          <LeftLabelTextField
            type={type}
            edit={edit}
            required={required}
            label={label}
            labelColumnWidth={labelColumnWidth}
            tooltip={tooltip}
            tooltipText={tooltipText}
          >
            <MultiSelectWithChips
              {...props}
              options={selectOptions || options}
              inputFieldProps={{
                id: name,
                label: edit && !disabled && value === "" ? `Select` : "",

                name: name,
                onChange: handleChange,
                onBlur: handleBlur,
                error: error && isTouched,
                helperText: error && isTouched ? error : "",
                fullWidth: true,
                disabled: disabled || !edit || loader,

                InputLabelProps: { shrink: true },
                inputProps: inputProps,
                InputProps: {
                  ...(((disabled || !edit) && { disableUnderline: true }) ||
                    {}),
                  ...inputProps,
                },
              }}
            />
          </LeftLabelTextField>
        )) || (
          <MultiSelectWithChips
            {...props}
            options={selectOptions || options}
            inputFieldProps={{
              id: name,
              label: label,
              required,
              name: name,
              onChange: handleChange,
              onBlur: handleBlur,
              error: error && isTouched,
              helperText: error && isTouched ? error : "",
              fullWidth: true,
              disabled: disabled || !edit || loader,

              InputLabelProps: { shrink: true },
              inputProps: inputProps,
              InputProps: {
                ...(((disabled || !edit) && { disableUnderline: true }) || {}),
                ...inputProps,
              },
            }}
          />
        )}
      </Grid>
    );
  } else if (type === "checkBox") {
    return (
      <Grid
        item
        xs={12}
        md={6}
        lg={6}
        style={{
          ...generateGridStyle({
            indexInfo: index,
            columnInfo: gridLayout?.gridTemplateColumns?.split(" ")?.length,
          }),
          ...inlineStyle,
        }}
        align="left"
        key={index}
        className={`${"orderStyle"} ${(smallFont && "smallFont") || ""}`}
      >
        {title && (
          <Typography className={"fieldTitle"} variant={titleVariant}>
            {title}
          </Typography>
        )}
        {(leftSideLabel && (
          <LeftLabelTextField
            type={type}
            edit={edit}
            required={required}
            labelColumnWidth={labelColumnWidth}
            tooltip={tooltip}
            tooltipText={tooltipText}
          >
            {" "}
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                style={{
                  fontSize: `${font * 6}px`,
                }}
              >
                {label}
              </FormLabel>

              <FormGroup name={name}>
                {options.map((opt) => (
                  <Field
                    type="checkbox"
                    name={opt.name}
                    color="primary"
                    component={CheckboxWithLabel}
                    key={opt.name}
                    required={opt.required}
                    Label={{
                      label: label,
                    }}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </LeftLabelTextField>
        )) || (
          <FormControl component="fieldset">
            {showMiniLabel && (
              <FormLabel
                component="legend"
                style={{
                  fontSize: `${font * 6}px`,
                }}
              >
                {name}
              </FormLabel>
            )}

            <FormGroup name={name}>
              {options.map((opt) => (
                <Field
                  type="checkbox"
                  name={opt.name}
                  color="primary"
                  component={CheckboxWithLabel}
                  key={opt.name}
                  required={opt.required}
                  Label={{
                    label: label,
                  }}
                />
              ))}
            </FormGroup>
          </FormControl>
        )}
      </Grid>
    );
  } else if (type === "checkbox") {
    return (
      <Grid
        item
        xs={12}
        md={6}
        lg={6}
        style={{
          ...generateGridStyle({
            indexInfo: index,
            columnInfo: gridLayout?.gridTemplateColumns?.split(" ")?.length,
          }),
          ...inlineStyle,
        }}
        align="left"
        key={index}
        className={`${"orderStyle"} ${(smallFont && "smallFont") || ""}`}
      >
        {title && (
          <Typography className={"fieldTitle"} variant={titleVariant}>
            {title}
          </Typography>
        )}
        {(leftSideLabel && (
          <LeftLabelTextField
            type={type}
            edit={edit}
            required={required}
            labelColumnWidth={labelColumnWidth}
            tooltip={tooltip}
            tooltipText={tooltipText}
          >
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                style={{
                  fontSize: `${font * 6}px`,
                }}
              ></FormLabel>

              <FormGroup name={name}>
                <Field
                  type="checkbox"
                  name={name}
                  color="primary"
                  component={CheckboxWithLabel}
                  required={required}
                  disabled={disabled || !edit}
                  Label={{
                    label: label,
                  }}
                />
              </FormGroup>
            </FormControl>
          </LeftLabelTextField>
        )) || (
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              style={{
                fontSize: `${font * 6}px`,
              }}
            ></FormLabel>

            <FormGroup name={name}>
              <Field
                type="checkbox"
                name={name}
                color="primary"
                component={CheckboxWithLabel}
                required={required}
                disabled={disabled || !edit}
                Label={{
                  label: label,
                }}
              />
            </FormGroup>
          </FormControl>
        )}
      </Grid>
    );
  } else if (type === "radio") {
    return (
      <Grid
        item
        xs={12}
        md={6}
        lg={6}
        style={{
          ...generateGridStyle({
            indexInfo: index,
            columnInfo: gridLayout?.gridTemplateColumns?.split(" ")?.length,
          }),
          ...inlineStyle,
        }}
        align="left"
        key={index}
        className={`${"orderStyle"} ${(smallFont && "smallFont") || ""}`}
      >
        {title && (
          <Typography className={"fieldTitle"} variant={titleVariant}>
            {title}
          </Typography>
        )}
        {(leftSideLabel && (
          <LeftLabelTextField
            type={type}
            label={label}
            edit={edit}
            required={required}
            labelColumnWidth={labelColumnWidth}
            tooltip={tooltip}
            tooltipText={tooltipText}
          >
            <FormControl component="fieldSet">
              <RadioGroup
                row
                aria-label={label}
                name={name}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                error={error && isTouched}
                helperText={error && isTouched ? error : ""}
                disabled={disabled || !edit}
              >
                {(selectOptions || options).map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option.value}
                    disabled={disabled || !edit}
                    control={<Radio color="primary" disabled={!edit} />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
              {error && isTouched && (
                <FormHelperText style={{ color: "red" }}>
                  {error}
                </FormHelperText>
              )}
            </FormControl>
          </LeftLabelTextField>
        )) || (
          <FormControl component="fieldSet">
            <FormLabel
              component="legend"
              style={{
                fontSize: `${font * 6}px`,
                ...inputProps?.labelStyle,
              }}
            >
              {label}
              {required && <span style={{ color: "red" }}>*</span>}
            </FormLabel>
            <RadioGroup
              row
              aria-label={label}
              name={name}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              error={error && isTouched}
              helperText={error && isTouched ? error : ""}
              disabled={disabled || !edit}
              aria-labelledby="demo-radio-buttons-group-label"
            >
              {(selectOptions || options).map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option.value}
                  disabled={disabled || !edit}
                  control={<Radio color="primary" disabled={!edit} />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {error && isTouched && (
              <FormHelperText style={{ color: "red" }}>{error}</FormHelperText>
            )}
          </FormControl>
        )}
      </Grid>
    );
  } else if (type === "switch") {
    return (
      <Grid
        item
        xs={12}
        md={6}
        lg={6}
        align="left"
        key={index}
        className={`${"orderStyle"} ${(smallFont && "smallFont") || ""}`}
      >
        {title && (
          <Typography className={"fieldTitle"} variant={titleVariant}>
            {title}
          </Typography>
        )}

        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                variant="outlined"
                disabled={disabled || !edit}
                color="primary"
                name={name}
                checked={value}
                onChange={handleChange}
              />
            }
            label={label}
          />
        </FormGroup>
      </Grid>
    );
  } else if (
    type === "date" ||
    (isDate && type !== "time" && type !== "month" && type !== "text")
  ) {
    return (
      <Grid
        item
        xs={12}
        md={6}
        lg={6}
        style={{
          ...generateGridStyle({
            indexInfo: index,
            columnInfo: gridLayout?.gridTemplateColumns?.split(" ")?.length,
          }),
          ...inlineStyle,
        }}
        align="left"
        key={index}
        className={`${"orderStyle"} ${(smallFont && "smallFont") || ""}`}
      >
        {title && (
          <Typography className={"fieldTitle"} variant={titleVariant}>
            {title}
          </Typography>
        )}

        {(leftSideLabel && (
          <LeftLabelTextField
            type={type}
            edit={edit}
            required={required}
            label={label}
            labelColumnWidth={labelColumnWidth}
            tooltip={tooltip}
            tooltipText={tooltipText}
          >
            <LocalizationProvider
              dateAdapter={AdapterMoment}
              locale={localLang}
            >
              <DatePicker
                inputFormat="DD-MM-YYYY"
                mask="__-__-____"
                id={name}
                type={"date"}
                name={name}
                required={required}
                onChange={(value) => {
                  if (
                    dayjs(
                      dayjs(+value || value).format(constants.date.DATE_FORMAT),
                    ).isValid()
                  ) {
                    handleChange({
                      target: {
                        name,
                        value: dayjs(+value || value).format(
                          constants.date.DATE_FORMAT,
                        ),
                      },
                    });
                  } else {
                    setFieldError(name, "Invalid date format");
                  }
                }}
                value={
                  value
                    ? dayjs(+value || value).format(constants.date.DATE_FORMAT)
                    : null
                }
                {...{
                  ...(inputProps?.min && {
                    minDate: moment(inputProps?.min),
                  }),
                  ...(inputProps?.max && {
                    maxDate: moment(inputProps?.max),
                  }),
                }}
                InputLabelProps={{ shrink: true }}
                disabled={disabled || !edit}
                // inputProps={inputProps}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={error && isTouched}
                    // sx={{
                    //   '& >.MuiInput-root.MuiInputBase-root': {
                    //     marginTop: '20px'
                    //   }
                    // }}
                    helperText={error && isTouched ? error : ""}
                    onBlur={(e) => {
                      setFieldTouched(name, true, true);
                      handleBlur({
                        target: {
                          name,
                          value: e,
                        },
                      });
                    }}
                    {...(isDateDisable && {
                      onKeyDown: (e) => {
                        e.preventDefault();
                      },
                    })}
                    variant={variant}
                    InputProps={{
                      ...params.InputProps,
                      ...((params?.disabled || !edit) && {
                        endAdornment: (
                          <InputAdornment position="end">{null}</InputAdornment>
                        ),
                      }),
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </LeftLabelTextField>
        )) || (
          <div className={"tooltipContainer"}>
            <LocalizationProvider
              dateAdapter={AdapterMoment}
              locale={localLang}
            >
              <DatePicker
                inputFormat="DD-MM-YYYY"
                mask="__-__-____"
                id={name}
                label={label}
                type={"date"}
                name={name}
                onChange={(value) => {
                  if (
                    dayjs(
                      dayjs(+value || value).format(constants.date.DATE_FORMAT),
                    ).isValid()
                  ) {
                    handleChange({
                      target: {
                        name,
                        value: dayjs(+value || value).format(
                          constants.date.DATE_FORMAT,
                        ),
                      },
                    });
                  } else {
                    setFieldError(name, "Invalid date format");
                  }
                }}
                value={
                  value
                    ? dayjs(+value || value).format(constants.date.DATE_FORMAT)
                    : null
                }
                {...{
                  ...(inputProps?.min && {
                    minDate: moment(inputProps?.min),
                  }),
                  ...(inputProps?.max && {
                    maxDate: moment(inputProps?.max),
                  }),
                }}
                disabled={disabled || !edit}
                InputLabelProps={{ shrink: true }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required={required}
                    fullWidth
                    error={error && isTouched}
                    sx={{
                      "& >.MuiInput-root.MuiInputBase-root": {
                        marginTop: "20px",
                      },
                    }}
                    helperText={error && isTouched ? error : ""}
                    onBlur={(e) => {
                      setFieldTouched(name, true, true);
                      handleBlur({
                        target: {
                          name,
                          value: e,
                        },
                      });
                    }}
                    {...(isDateDisable && {
                      onKeyDown: (e) => {
                        e.preventDefault();
                      },
                    })}
                    variant={variant}
                    InputProps={{
                      ...params.InputProps,
                      ...((params?.disabled || !edit) && {
                        endAdornment: (
                          <InputAdornment position="end">{null}</InputAdornment>
                        ),
                      }),
                    }}
                  />
                )}
              />
            </LocalizationProvider>

            {tooltip && (
              <div className={"tooltipIcon"}>
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                  <Tooltip
                    PopperProps={{
                      disablePortal: true,
                    }}
                    onClose={() => setOpen(false)}
                    open={open}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title={tooltipText}
                    arrow
                    placement="top"
                  >
                    <IconButton onClick={() => setOpen(true)}>
                      <CommonSVG name="InfoIcon" />
                    </IconButton>
                  </Tooltip>
                </ClickAwayListener>
              </div>
            )}
          </div>
        )}
      </Grid>
    );
  } else {
    return (
      <Grid item xs={6} md={6} lg={6} align="left" key={index}>
        <TextField
          variant={variant}
          id={name}
          label={label}
          type={
            showDateWithDisabled
              ? "text"
              : type || (isDate ? "date" : type || "text")
          }
          sx={{ width: width }}
          multiline={(type || (isDate ? "date" : "text")) === "text"}
          name={name}
          value={
            isDate &&
            type !== "time" &&
            type !== "month" &&
            type !== "month" &&
            type !== "text"
              ? dayjs(+value || value).format(constants.date.DATE_FORMAT)
              : showDateWithDisabled
                ? getDateValue(value)
                : disabled || !edit
                  ? checkIsAmountField(name, value)
                  : value
          }
          required={required}
          placeholder={placeholder || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          error={error && isTouched}
          helperText={
            error && isTouched
              ? error
              : isToWords &&
                checkIsAmountField(name, value) && (
                  <CurrencyToWordsComp
                    amount={value}
                    textAlign="left"
                    onlyString={true}
                  />
                )
          }
          fullWidth
          disabled={disabled || !edit}
        />
      </Grid>
    );
  }
};
const SchemaForm = ({
  schema,
  initialValues,
  onSubmit = () => null,
  fieldOrder = {},
  column,
  edit = false,
  bottomButton = false,
  isSubmitDisable = false,
  summitButtonTitle = "Submit",
  schemaActions = [],
  onClear = false,
  formRef = null,
  actionButton = false,
  onUpdate = false,
  onUpdate2 = () => {},
  smallFont = false,
  leftSideLabel = false,
  labelColumnWidth = false,
  onDependentSchemaChange = () => {},
  operationType = "add",
  gridLayout = false,
  updateSubmitBtnRef = () => {},
  clearButtonTitle = "Clear",
  style = {},
  initialStateValidation = true,
  validate = () => {},
}) => {
  const [dependentValidationSchema, setDependentValidationSchema] = useState(
    {},
  );

  const ref = useRef();
  const submitFormRef = useRef(null);

  const [initVals, setInitalVals] = useState(
    getInitalValues(schema, initialValues),
  );

  function reAssignInitialValues() {
    setInitalVals(getInitalValues(schema));
  }

  useEffect(() => {
    const initdata = getInitalValues(schema, initialValues);
    const dependentFieldsInitValues = Object.keys(
      dependentValidationSchema,
    ).reduce((p, cr) => {
      return {
        ...p,
        ...((initdata?.[cr] && {
          [cr]: initdata?.[cr],
        }) ||
          {}),
      };
    }, {});

    const { current: { values = {} } = {} } = ref || {};

    // setInitalVals({
    //   ...values,
    //   ...dependentFieldsInitValues
    // });
    onDependentSchemaChange();
  }, [dependentValidationSchema]);
  // const initVals = getInitalValues(schema, initialValues);
  function extratcImportantAttr(sch) {
    return sch.map((item) => {
      const { extraInfo, inputProps, ...rest } = item;
      return {
        ...rest,
      };
    });
  }
  useEffect(() => {
    setInitalVals(getInitalValues(schema, initialValues));
  }, [JSON.stringify(extratcImportantAttr(schema))]);

  useEffect(() => {
    updateSubmitBtnRef(submitFormRef);
    if (submitFormRef?.current) {
      // Add a listener to monitor changes in the second button's properties
      const observer = new MutationObserver((mutationsList) => {
        updateSubmitBtnRef(submitFormRef);
        // for (const mutation of mutationsList) {
        //   if (mutation?.type === 'disabled') {
        //     // When the second button's style changes, update the first button's style
        //     if (submitButtonRef.current && submitFormRef?.current) {
        //       submitButtonRef.current.disabled = submitFormRef?.current.disabled;
        //       // submitFormRef.current.textContent = submitButtonRef?.current.textContent;
        //     }
        //   }
        // }
      });
      // Observe style attribute changes on the second button
      observer.observe(submitFormRef?.current, { attributes: true });
    }
  }, []);
  const initialValueForDependentStorage = getInitalValues(
    schema,
    initialValues,
  );

  return (
    <Formik
      innerRef={formRef || ref}
      enableReinitialize={true}
      initialValues={initVals || ref}
      validationSchema={Yup.object().shape({
        ...validationSchema(schema),
        ...dependentValidationSchema,
      })}
      validate={validate}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        await onSubmit(values);
        setSubmitting(false);
      }}
    >
      {(formikProps) => {
        const {
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          setFieldError,
          resetForm,
        } = formikProps;

        return (
          <form
            style={{
              ...style,
            }}
            onSubmit={handleSubmit}
            noValidate
          >
            {!!isSubmitDisable && (
              <Grid
                container
                xs={12}
                style={{
                  position: "absolute",
                  zIndex: 1,

                  background:
                    "radial-gradient(circle, rgba(2,0,36,0) 0%, rgba(0,0,0,0.13786764705882348) 0%, rgba(0,0,0,0) 41%)",
                }}
              >
                <CommonLoaderScreen height="auto" />
              </Grid>
            )}
            <Grid
              container
              className={"formGridContainer"}
              spacing={2}
              style={{
                ...(gridLayout || {}),
              }}
            >
              {schema.map((field, index) => {
                const {
                  name = "",
                  label = "",
                  dependentOn = "",
                  dependentValue = false,
                  regex,
                  type = "",
                  dependenetOnValueButNotRequired = "",
                  onFieldValueChange = (e) => e.target.value,
                  onFieldValueBlur = () => {},
                  checkDefaultValueOnRender = false,
                  isDateDisable = false,
                } = field;

                const onChange = (e) => {
                  const fieldValue = onFieldValueChange(e) || e.target.value;
                  e.target.value = fieldValue;
                  handleChange(e);
                };
                async function setErrorOnField(
                  fieldName,
                  error = "Invalid Value",
                ) {
                  await formikProps?.setFieldTouched(fieldName, true);
                  await formikProps?.setFieldError(fieldName, error);
                }
                const onBlurAction = async (e) => {
                  if (type === "" || type === "text") {
                    e.target.value = checkIsAmountField(
                      name,
                      e.target.value,
                      "onlyNumber",
                    );
                    await setFieldValue(name, e.target.value);
                  }
                  handleBlur(e);
                  onFieldValueBlur({
                    e,
                    setErrorOnField,
                    formikProps,
                  });
                };
                const value = _get(values, name, "");
                const error = _get(errors, name, "");
                const isTouched = _get(touched, name, false);
                onUpdate && onUpdate(formikProps, field);
                if (field?.isDependent) {
                  if (
                    !dependenetOnValueButNotRequired
                      ?.split("|")
                      ?.includes(values[dependentOn]) &&
                    (dependentValue
                      ?.split("|")
                      ?.includes(values[dependentOn] + "") ||
                      (dependentValue === null &&
                        values?.[dependentOn] !== "" &&
                        values?.[dependentOn] !== undefined))
                  ) {
                    !dependentValidationSchema?.[name] &&
                      setDependentValidationSchema({
                        ...dependentValidationSchema,
                        [name]:
                          field?.required === false
                            ? Yup.string()
                                .matches(
                                  blankSpaceRegex,
                                  "* This field cannot contain only blankspaces",
                                )
                                .test(
                                  `${name} validation`,
                                  `Invalid ${labelname}`,
                                  (value) => {
                                    const reg =
                                      regex ||
                                      constants?.dynamicRegex()?.[name] ||
                                      constants?.regex?.[name];
                                    if (reg && value) {
                                      return reg.test(value);
                                    }
                                    return true;
                                  },
                                )
                            : Yup.string()
                                .required(`${label} is required`)
                                .matches(
                                  blankSpaceRegex,
                                  "* This field cannot contain only blankspaces",
                                )
                                .test(
                                  `${name} validation`,
                                  `Invalid ${label}`,
                                  (value) => {
                                    const reg =
                                      regex ||
                                      constants?.dynamicRegex()?.[name] ||
                                      constants?.regex?.[name];
                                    if (reg) {
                                      return reg.test(value);
                                    }
                                    return true;
                                  },
                                ),
                      });
                    const updatedValue = checkDefaultValueOnRender
                      ? value || initialValueForDependentStorage?.[name]
                      : value;
                    if (checkDefaultValueOnRender) {
                      values[name] = updatedValue;
                    }
                    return (
                      <RenderFields
                        key={index}
                        name={name}
                        leftSideLabel={leftSideLabel}
                        labelColumnWidth={labelColumnWidth}
                        value={updatedValue}
                        error={error}
                        index={index}
                        smallFont={smallFont}
                        operationType={operationType}
                        isSubmitting={isSubmitting}
                        isTouched={isTouched}
                        column={column}
                        order={fieldOrder[name]}
                        edit={edit}
                        formikProps={formikProps}
                        onUpdate2={onUpdate2}
                        setErrorOnField={setErrorOnField}
                        {...field}
                        {...{
                          values,
                          errors,
                          touched,
                          handleChange: onChange,
                          handleBlur: onBlurAction,
                          handleSubmit,
                          isSubmitting,
                          setFieldValue,
                          setFieldError,
                        }}
                        gridLayout={gridLayout}
                        isDateDisable={isDateDisable}
                      />
                    );
                  } else if (
                    (dependenetOnValueButNotRequired &&
                      dependenetOnValueButNotRequired
                        ?.split("|")
                        ?.includes(values[dependentOn])) ||
                    (dependentValue === null &&
                      values?.[dependentOn] !== "" &&
                      values?.[dependentOn] !== undefined)
                  ) {
                    if (dependentValidationSchema?.[name]) {
                      const temp = { ...dependentValidationSchema };

                      delete temp[name];

                      values[name] = "";

                      dependentValidationSchema?.[name] &&
                        setDependentValidationSchema({ ...temp });
                    }
                    return (
                      <RenderFields
                        key={index}
                        name={name}
                        leftSideLabel={leftSideLabel}
                        labelColumnWidth={labelColumnWidth}
                        value={value}
                        error={error}
                        index={index}
                        isSubmitting={isSubmitting}
                        isTouched={isTouched}
                        smallFont={smallFont}
                        operationType={operationType}
                        column={column}
                        order={fieldOrder[name]}
                        edit={edit}
                        formikProps={formikProps}
                        onUpdate2={onUpdate2}
                        setErrorOnField={setErrorOnField}
                        {...field}
                        {...{
                          values,
                          errors,
                          touched,
                          handleChange: onChange,
                          handleBlur: onBlurAction,
                          handleSubmit,
                          isSubmitting,
                          setFieldValue,
                          setFieldError,
                        }}
                        gridLayout={gridLayout}
                        required={false}
                        isDateDisable={isDateDisable}
                      />
                    );
                  } else {
                    const temp = { ...dependentValidationSchema };
                    delete temp[name];
                    values[name] = "";
                    dependentValidationSchema?.[name] &&
                      setDependentValidationSchema({ ...temp });
                    return;
                  }
                }

                return (
                  <RenderFields
                    name={name}
                    leftSideLabel={leftSideLabel}
                    labelColumnWidth={labelColumnWidth}
                    key={name}
                    value={value}
                    error={error}
                    operationType={operationType}
                    index={index}
                    smallFont={smallFont}
                    isSubmitting={isSubmitting}
                    formikProps={formikProps}
                    isTouched={isTouched}
                    column={column}
                    order={fieldOrder[name]}
                    edit={edit}
                    onUpdate2={onUpdate2}
                    setErrorOnField={setErrorOnField}
                    {...field}
                    {...{
                      values,
                      errors,
                      touched,
                      handleChange: onChange,
                      handleBlur: onBlurAction,
                      handleSubmit,
                      isSubmitting,
                      setFieldValue,
                      setFieldError,
                    }}
                    gridLayout={gridLayout}
                    isDateDisable={isDateDisable}
                  />
                );
              })}
              {actionButton && (
                <Grid
                  item
                  xs={12}
                  align="right"
                  style={{
                    order: 1000,
                    ...(gridLayout && {
                      gridRowStart: "-1",
                      gridColumnStart: "-2",
                    }),
                  }}
                >
                  {edit && (
                    <>
                      {schemaActions.map((btn) => (
                        <Button
                          key={btn.label}
                          variant={btn.variant}
                          onClick={btn.onSubmit}
                          color={btn.color}
                          className={"buttons"}
                          disabled={isSubmitDisable}
                        >
                          {btn.label}
                        </Button>
                      ))}
                      {onClear && (
                        <Button
                          key={"clear"}
                          variant={"outlined"}
                          color={"primary"}
                          onClick={() => {
                            reAssignInitialValues();
                            resetForm();
                            onClear();
                          }}
                          className={"buttons"}
                        >
                          {clearButtonTitle || "Clear"}
                        </Button>
                      )}

                      <Button
                        className={bottomButton ? "submitButton" : ""}
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={
                          !_isEmpty(errors) ||
                          isSubmitting ||
                          isSubmitDisable ||
                          _isEqual(values, initVals)
                        }
                      >
                        {summitButtonTitle || "submit"}
                      </Button>
                    </>
                  )}
                </Grid>
              )}
              <Button
                className={bottomButton ? "submitButton" : ""}
                style={{
                  display: "none",
                }}
                ref={submitFormRef}
                type="submit"
                variant="contained"
                color="primary"
                disabled={
                  !_isEmpty(errors) ||
                  isSubmitting ||
                  isSubmitDisable ||
                  (initialStateValidation ? _isEqual(values, initVals) : false)
                }
              >
                {/* {summitButtonTitle} */}
              </Button>
            </Grid>
          </form>
        );
      }}
    </Formik>
  );
};
export default styled(SchemaForm)(({ theme }) => ({
  width: "100%",
  position: "relative",
  display: "block",

  "& .MuiFormLabel-asterisk.MuiInputLabel-asterisk": {
    color: theme.palette.error.main,
  },

  "& .submitButton": {
    position: "absolute",
    bottom: 0,
    right: 0,
  },

  "& .buttons": {
    marginRight: theme.spacing(2),
    fontWeight: "600",
  },
}));
