import * as React from "react";

import { times } from "lodash";
import { InjectedIntlProps, injectIntl } from "react-intl";

import { Pagination } from "src/components/common/Pagination/Pagination";
import { PaginationLink } from "src/components/common/PaginationLink/PaginationLink";
import { PaginationList } from "src/components/common/PaginationList/PaginationList";
import { PaginationNext } from "src/components/common/PaginationNext/PaginationNext";
import { PaginationPrev } from "src/components/common/PaginationPrev/PaginationPrev";

export interface IProps
  extends React.HTMLAttributes<HTMLDivElement>,
    InjectedIntlProps {
  length: number;
  initialIndex?: number;
  onPageChange?: (index: number) => any;
}

interface IState {
  currentIndex: number;
}

export const UncontrolledPagination = injectIntl(
  class extends React.Component<IProps, IState> {
    public state = {
      currentIndex: 0
    };

    public componentDidMount() {
      const { initialIndex } = this.props;
      if (typeof initialIndex === "number") {
        this.setState({ currentIndex: initialIndex });
      }
    }

    public render() {
      const { length, onPageChange, intl, ...props } = this.props;
      const { currentIndex } = this.state;
      return (
        <Pagination {...props}>
          <PaginationList>
            {times(length).map(i => {
              const onClick = () => this.changeCurrent(i);
              return (
                <PaginationLink
                  key={i}
                  isCurrent={currentIndex === i}
                  onClick={onClick}
                >
                  {i + 1}
                </PaginationLink>
              );
            })}
          </PaginationList>
          <PaginationNext onClick={this.onNextClick}>
            {intl.formatMessage({ id: "Pagination.next" })}
          </PaginationNext>
          <PaginationPrev onClick={this.onPrevClick}>
            {intl.formatMessage({ id: "Pagination.prev" })}
          </PaginationPrev>
        </Pagination>
      );
    }

    private changeCurrent = (index: number) => {
      const { onPageChange } = this.props;
      this.setState({ currentIndex: index });
      if (typeof onPageChange === "function") {
        onPageChange(index);
      }
    };

    private onNextClick = () => {
      const { currentIndex } = this.state;
      const { length } = this.props;
      if (currentIndex < length - 1) {
        this.setState({ currentIndex: currentIndex + 1 });
      }
    };

    private onPrevClick = () => {
      const { currentIndex } = this.state;
      if (currentIndex > 0) {
        this.setState({ currentIndex: currentIndex - 1 });
      }
    };
  }
);
