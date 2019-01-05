import * as yup from "yup";

export interface ISchemaValidator {
  validate(values: object): object | Promise<object>;
}

export class SchemaValidator implements ISchemaValidator {
  private schema: yup.ObjectSchema<object>;
  constructor(schema: yup.ObjectSchema<object>) {
    this.schema = schema;
  }

  public validate = async (values: object) => {
    try {
      await this.schema.validateSync(values, { abortEarly: false });
      return {};
    } catch (e) {
      return e.inner.reduce(
        (errors: {}, innerError: yup.ValidationError) => ({
          ...errors,
          [innerError.path]: innerError.message
        }),
        {}
      );
    }
  };
}
