import React from "react";
import styled from "styled-components";

const StyledWrapper = styled.div`
    border-radius: 8px;
    padding: 20px;
    background-color: #933;
    color: white;
    position: absolute;
    top: 10px;
    right: 40%;
    z-index: 100;
`;

export default function FlyInAlert({ value = "" }: { value?: string }) {
    return (
        <StyledWrapper>
            <span>{value}</span>
        </StyledWrapper>
    );
}
