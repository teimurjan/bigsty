/** @jsx jsx */
import * as React from 'react';

import { Global, css, jsx } from '@emotion/core';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useTheme } from 'emotion-theming';
import { ITheme } from 'src/themes';

interface IProps {
  className?: string;
  placeholder?: string;
  onChange?: (serializedContent: string) => void;
  onBlur?: (e?: React.FocusEvent) => void;
  onFocus?: (e?: React.FocusEvent) => void;
  hasError?: boolean;
  initialValue?: string;
}

interface IEditor {
  getData: () => string;
}

export const WYSIWYG: React.SFC<IProps> = ({ onChange, onBlur, onFocus, initialValue, placeholder, hasError }) => {
  const theme = useTheme<ITheme>();

  return (
    <div className="content">
      <Global
        styles={css`
          .ck.ck-content {
            height: 300px;
            border-color: ${hasError ? `${theme.danger} !important` : undefined};
          }
        `}
      />
      <CKEditor
        editor={ClassicEditor}
        config={{
          toolbar: {
            items: [
              'heading',
              'bold',
              'italic',
              'link',
              'bulletedList',
              'numberedList',
              'insertTable',
              '|',
              'undo',
              'redo',
            ],
          },
          placeholder,
        }}
        data={initialValue}
        onInit={() => document.querySelector('.ck.ck-content')}
        onChange={(_: any, editor: IEditor) => {
          const data = editor.getData();
          onChange && onChange(data);
        }}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    </div>
  );
};
