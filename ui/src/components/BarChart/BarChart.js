import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import { styled, Grid } from "@mui/material";
import CurvedArrowLine from "../../ui_components/CurveArrowedLine";
import * as d3 from "d3";

// import rd3 from "react-d3-library";
import "./BarChart.css";

const initializeTextVisible = (len) => new Array(len).fill(false).map((el) => el);
const labelStyle = {
  height: "50px",
  width: "25px",
  border: `1px solid black`,
  backgroundColor: "blue",
};
const dataStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const BarChart = (props) => {
  const { chartData, totalDataLength, color, height, width } = props;
  const [data, setData] = useState(chartData);
  const [textVisible, setTextVisible] = useState(initializeTextVisible(chartData.length));

  const barWidth = 25;
  const chartWidth = data.length * (barWidth + 5);
  const xScale = d3.scaleLinear().domain([0, data.length]).range([0, chartWidth]);
  const yScale = (d) => 10 * d;
  const xOffset = window.innerWidth / 2 - chartWidth / 2;

  const maxHeight = yScale(totalDataLength);

  console.log(data);

  const handleSetVisible = (idx) => {
    const v = initializeTextVisible(data.length);
    v[idx] = true;
    setTextVisible(v);
  };

  return (
    <Fragment>
      <svg height={height} width={width}>
        {data.map((d, idx) => {
          const barHeight = yScale(d[1]);
          const x = xScale(idx) + xOffset;
          const y = maxHeight - barHeight;
          const arrowSrc = y + barHeight;
          const arrowDest = y + barHeight + 100;
          return (
            <Fragment>
              <g
                key={idx}
                style={dataStyle}
                width={barWidth}
                height={maxHeight}
                transform={`translate(${x}, ${0})`}
                // style={{ border: "1px solid black" }}
                onClick={() => handleSetVisible(idx)}
              >
                <rect width={barWidth} height={y} fill={"black"} />
                <rect width={barWidth} transform={`translate(${0}, ${y})`} height={barHeight} fill={color} />
                <text style={labelStyle}>1</text>
              </g>
              <CurvedArrowLine
                color={color}
                visible={textVisible[idx]}
                data={d[0]}
                start={{ x, y: arrowSrc }}
                stop={{ x: x - 100, y: arrowDest }}
              />
            </Fragment>
          );
        })}
      </svg>
    </Fragment>
  );
};

export default BarChart;
