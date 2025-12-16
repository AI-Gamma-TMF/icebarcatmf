import React from 'react';
import styled from 'styled-components';
const ProgressContainer = styled.div`
  width: 60px;
  height: 20px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: ${(props) => props.color};
  width: ${(props) => props.fillWidth}px;
  border-radius: 5px;
  transition: width 0.3s ease-in-out;
`;
const colorShades = [
  '#FFF5EB',
  '#FFEFE0',
  '#FFE0C7',
  '#FFD1B3',
  '#F2B997',
  '#E4A27A',
  '#D68A5E',
  '#C87341',
  '#BA5C25',
  '#A35020',
  '#8C451C',
  '#753917',
  '#5E2E13',
  '#47220E',
  '#30170A',
];

const getDarkenedColor = (progress) => {
  const index = Math.min(Math.floor((progress / 100) * colorShades.length), colorShades.length - 1);
  return colorShades[index];
};

const ProgressBar = ({ currentPlayer, totalPlayer }) => {
  const progress = Math.min(Math.max((currentPlayer / totalPlayer) * 100, 0), 100);
  const fillWidth = (progress / 100) * 60; // max fill width is 60px
  const color = getDarkenedColor(progress);

  return (
    <ProgressContainer>
      <ProgressFill fillWidth={fillWidth} color={color} />
    </ProgressContainer>
  );
};
export default ProgressBar;
