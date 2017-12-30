import { IntlFunction } from './injectIntl';

export const getFieldErrorFromProps = (props: { errors: Map<string, object>, intl: IntlFunction },
                                       field: string): false | string => {
  const {errors, intl} = props;
  if (!errors) {
    return false;
  } else {
    const errorCodes = errors[field];
    return errorCodes && errorCodes.length > 0 ? intl(errorCodes[0]) : false;
  }
};