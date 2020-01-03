/** @jsx jsx */
import * as React from 'react';

import { Global, css, jsx } from '@emotion/core';
import classNames from 'classnames';
import {
  Editor,
  EditorState,
  RichUtils,
  DraftEditorCommand,
  ContentBlock,
  Modifier,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import { useTheme } from 'emotion-theming';
import { faBold, faItalic, faUnderline } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ITheme } from 'src/themes';
import { Button } from '../Button/Button';
import { flexMixin, alignItemsCenterMixin } from 'src/styles/mixins';

interface IProps {
  className?: string;
  placeholder?: string;
  onChange?: (serializedContent: string) => void;
  onBlur?: (e?: React.FocusEvent) => void;
  onFocus?: (e?: React.FocusEvent) => void;
  hasError?: boolean;
  initialValue?: string;
}

interface IToolbarProps {
  controls: Array<{
    isActive: boolean;
    onClick: React.MouseEventHandler;
    icon: React.ReactNode;
  }>;
}

const hasStyle = (editorState: EditorState, style: string) => {
  const selection = editorState.getSelection();

  return editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getInlineStyleAt(selection.getStartOffset())
    .some(s => s === style);
};

const isOfType = (editorState: EditorState, type: string) => {
  const blockKey = editorState.getSelection().getAnchorKey();
  return (
    editorState
      .getCurrentContent()
      .getBlockForKey(blockKey)
      .getType() === type
  );
};

export function getBlockStyle(block: ContentBlock) {
  switch (block.getType()) {
    case 'H1':
      return 'is-size-1';
    case 'H2':
      return 'is-size-2';
    case 'H3':
      return 'is-size-3';
    case 'H4':
      return 'is-size-4';
    default:
      return '';
  }
}

const Toolbar: React.SFC<IToolbarProps> = ({ controls }) => {
  return (
    <div
      css={css`
        ${flexMixin};
        ${alignItemsCenterMixin};
        padding: 5px 0;
      `}
    >
      {controls.map(({ onClick, isActive, icon }, i) => (
        <Button
          key={i}
          color={isActive ? 'is-info' : 'is-light'}
          className="is-small"
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onMouseDown={e => {
            e.stopPropagation();
            e.preventDefault();
            onClick(e);
          }}
        >
          <span className="icon is-small">{icon}</span>
        </Button>
      ))}
    </div>
  );
};

export const WYSIWYG: React.SFC<IProps> = ({
  className,
  placeholder,
  onChange,
  onBlur,
  onFocus,
  hasError,
  initialValue,
}) => {
  const [isFocused, setFocused] = React.useState(false);
  const theme = useTheme<ITheme>();
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty());
  const [isInitialValueSet, setInitialValueSet] = React.useState(false);

  React.useEffect(() => {
    if (initialValue && !isInitialValueSet) {
      const deserializedContent = convertFromRaw(JSON.parse(initialValue));
      setEditorState(EditorState.createWithContent(deserializedContent));
      setInitialValueSet(true);
    }
  }, [initialValue, isInitialValueSet]);

  const handleKeyCommand = React.useCallback((command: DraftEditorCommand | string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  }, []);

  const handleChange = React.useCallback(
    (editorState: EditorState) => {
      if (onChange) {
        const currentContent = editorState.getCurrentContent();
        const isEmpty = currentContent.getPlainText('').length === 0;
        const serializedContent = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
        onChange(isEmpty ? '' : serializedContent);
      }
      setEditorState(editorState);
    },
    [onChange],
  );

  const onEditorFocus = React.useCallback(
    (e: React.FocusEvent) => {
      onFocus && onFocus(e);
      setFocused(true);
    },
    [onFocus],
  );

  const onEditorBlur = React.useCallback(
    (e: React.FocusEvent) => {
      onBlur && onBlur(e);
      setFocused(false);
    },
    [onBlur],
  );

  const toggleInlineStyle = React.useCallback(
    (newStyle: string) => {
      setEditorState(RichUtils.toggleInlineStyle(editorState, newStyle));
    },
    [editorState],
  );

  const changeBlockType = React.useCallback(
    (newType: string) => {
      setEditorState(
        EditorState.push(
          editorState,
          Modifier.setBlockType(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            isOfType(editorState, newType) ? '' : newType,
          ),
          'change-block-type',
        ),
      );
    },
    [editorState],
  );

  return (
    <React.Fragment>
      <Global
        styles={css`
          .wysiwyg-container {
            height: 300px;
          }

          .wysiwyg-container .DraftEditor-root,
          .wysiwyg-container .DraftEditor-editorContainer,
          .wysiwyg-container .public-DraftEditor-content {
            width: 100%;
            height: 100%;
          }

          .wysiwyg-container .public-DraftEditorPlaceholder-root {
            margin-bottom: -24px;
            pointer-events: none;
            color: ${theme.greyLight};
          }
        `}
      />
      <Toolbar
        controls={[
          {
            isActive: hasStyle(editorState, 'BOLD'),
            onClick: () => toggleInlineStyle('BOLD'),
            icon: <FontAwesomeIcon icon={faBold} />,
          },
          {
            isActive: hasStyle(editorState, 'ITALIC'),
            onClick: () => toggleInlineStyle('ITALIC'),
            icon: <FontAwesomeIcon icon={faItalic} />,
          },
          {
            isActive: hasStyle(editorState, 'UNDERLINE'),
            onClick: () => toggleInlineStyle('UNDERLINE'),
            icon: <FontAwesomeIcon icon={faUnderline} />,
          },
          ...[1, 2, 3, 4].map(i => {
            const type = `H${i}`;
            return {
              isActive: isOfType(editorState, type),
              onClick: () => changeBlockType(type),
              icon: type,
            };
          }),
        ]}
      />
      <div
        className={classNames(className, 'wysiwyg-container', 'input', 'has-background-light', {
          'is-focused': isFocused,
          'is-danger': hasError,
        })}
      >
        <Editor
          onFocus={onEditorFocus}
          onBlur={onEditorBlur}
          placeholder={isFocused ? undefined : placeholder}
          editorState={editorState}
          onChange={handleChange}
          handleKeyCommand={handleKeyCommand}
          blockStyleFn={getBlockStyle}
        />
      </div>
    </React.Fragment>
  );
};
