import React, { Suspense } from "react";
import cx from "classnames";
import {
  RowArrowIconStyled,
  RowStyled,
  RowInnerStyled,
  RowLabelOuterStyled,
  RowLabelInnerStyled,
  RowDotStyled,
  RowTitleStyled,
  SolutionAppWrapperStyled,
  SolutionAppTextStyled,
} from '@components/WorkSpaceLayout/SecondaryColumn/Components/Row/style';

const Row = ({
  item,
  active,
  onClick,
}: any) => {
  const viewOptions = item?.viewOptions || 'record';
  const classesTitle = cx("RowInner ", {
    "active": active === item?.id,
    [viewOptions]: true
  });

  const subtitle = [item.solution, item.app].filter(item => item).join(' • ');

  return !item ? null : (
    <>
      <RowStyled  
        viewOptions={viewOptions} 
        onClick={onClick}
      >
        <RowInnerStyled 
          viewOptions={viewOptions} 
          className={classesTitle} 
          solutionColor={item.color || 'red'}
        >
          <RowLabelOuterStyled className="RowLabelOuter">
            <RowLabelInnerStyled>
              <RowTitleStyled className="RowTitle">
                {item.record}
              </RowTitleStyled>

              {/* <Badge badge={newMention} opened={active} className="Notification"/> */}
            </RowLabelInnerStyled>
          </RowLabelOuterStyled>

          <SolutionAppWrapperStyled>
            <RowDotStyled solutionColor={item.color} />
            <SolutionAppTextStyled>{subtitle}</SolutionAppTextStyled>
          </SolutionAppWrapperStyled>
        </RowInnerStyled>
      </RowStyled>
    </>
  );
}

export default Row;
