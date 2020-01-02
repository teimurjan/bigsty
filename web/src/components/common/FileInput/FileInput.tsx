import * as React from 'react';

import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IProps extends Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'value'> {
  showPreview?: boolean;
  defaultValue?: string;
  onChange: (file: File | undefined) => any;
  value?: File;
}

export const FileInput: React.SFC<IProps> = ({ placeholder, value, showPreview = true, onChange }) => {
  const [previewURL, setPreviewURL] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (!value) return;

    const url = URL.createObjectURL(value);
    setPreviewURL(url);

    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    e => {
      if (onChange) {
        onChange(e.target.files ? e.target.files[0] : undefined);
      }
    },
    [onChange],
  );

  return (
    <div className="file-container">
      {showPreview && previewURL && <img src={previewURL} />}
      <div className="file has-name is-fullwidth">
        <label className="file-label">
          <input className="file-input" type="file" onChange={handleChange} />
          <span className="file-cta">
            <span className="file-icon">
              <FontAwesomeIcon icon={faFile} />
            </span>
            <span className="file-label">{placeholder}</span>
          </span>
          {value && value.name && <span className="file-name">{value.name}</span>}
        </label>
      </div>
    </div>
  );
};
