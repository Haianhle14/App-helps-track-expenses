import React, { useMemo } from 'react'
import styled, { keyframes } from 'styled-components'
import { useWindowSize } from '../../utils/useWindowSize'


const fallbackAnimation = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(500px, 250px); }
  100% { transform: translate(0, 0); }
`

const OrbStyled = styled.div`
  width: 70vh;
  height: 70vh;
  position: absolute;
  border-radius: 50%;
  margin-left: -37vh;
  margin-top: -37vh;
  background: linear-gradient(180deg, #F56692 0%, #F2994A 100%);
  filter: blur(400px);
  animation: ${({ anim }) => anim} 15s alternate linear infinite;
`

function Orb() {
  const { width, height } = useWindowSize()

  const dynamicMoveOrb = useMemo(() => {
    return keyframes`
      0% { transform: translate(0, 0); }
      50% { transform: translate(${width}px, ${height / 2}px); }
      100% { transform: translate(0, 0); }
    `
  }, [width, height])

  return <OrbStyled anim={width && height ? dynamicMoveOrb : fallbackAnimation} />
}

export default Orb
