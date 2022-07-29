import styled, { createGlobalStyle } from 'styled-components';
import { useState } from 'react';
import 'antd/dist/antd.css';
import MainArea from './MainArea';

const GlobalStyle = createGlobalStyle`
  :root {
    --white: #FFFFFF;
    --primary-blue: #006EB5;
    --blue-medium: #4F95DD;
    --blue-bg: #94C4F5;
    --navy: #082753;
    --black-100: #FAFAFA;
    --black-200: #f5f9fe;
    --black-300: #EDEFF0;
    --black-400: #E9ECF6;
    --black-450: #DDD;
    --black-500: #A9B1B7;
    --black-550: #666666;
    --black-600: #212121;
    --black-700: #000000;
    --blue-very-light: #F2F7FF;
    --yellow: #FBC412;
    --yellow-bg: #FFE17E;
    --red: #a8071a;
    --red-bg: #FFBCB7;
    --shadow:0px 10px 30px -10px rgb(9 105 250 / 15%);
    --shadow-bottom: 0 10px 13px -3px rgb(9 105 250 / 5%);
    --shadow-top: 0 -10px 13px -3px rgb(9 105 250 / 15%);
    --shadow-right: 10px 0px 13px -3px rgb(9 105 250 / 5%);
    --shadow-left: -10px 0px 13px -3px rgb(9 105 250 / 15%);
  }
  
  html { 
    font-size: 62.5%; 
  }

  .react-dropdown-select-option{
    color:var(--black) !important;
    background-color:var(--primary-color-light) !important;
  }
  .react-dropdown-select-option-label, .react-dropdown-select-option-remove{
    font-weight: 400;
    background-color:var(--primary-color-light);
    padding: 0.5rem;
  }

  body {
    font-family: "proxima-nova", "Helvetica Neue", "sans-serif";
    color: var(--black-600);
    background-color: var(--white);
    margin: 0;
    padding: 1rem 0;
    font-size: 1.6rem;
    font-weight: normal;
    line-height: 2.56rem;
  }

  a {
    text-decoration: none;
    color: var(--primary-blue);
  }

  h1 {
    color: var(--primary-blue);
    font-size: 3.2rem;
    font-weight: 700;
    
    @media (max-width: 760px) {
      font-size: 2.4rem;
    }
    @media (max-width: 480px) {
      font-size: 1.8rem;
    }
  }
  
  button.primary {
    border-radius: 0.2rem !important;
    font-size: 1.4rem !important;
    font-weight: normal !important;
    color: var(--white) !important;
    background-color: var(--primary-blue) !important;
    border: 1px solid var(--primary-blue) !important;
    cursor: pointer !important;
    padding: 0.4rem 1rem !important;
    &:hover {
      border: 1px solid var(--blue-medium) !important;
      background-color: var(--blue-medium) !important;
    }
    &:active{
      border: 1px solid var(--blue-medium) !important;
      background-color: var(--blue-medium) !important;
    }
  }

  button.secondary {
    border-radius: 0.2rem !important;
    font-size: 1.4rem !important;
    font-weight: normal !important;
    color: var(--black-600) !important;
    border: 1px solid var(--black-450) !important;
    cursor: pointer !important;
    padding: 0.4rem 1rem !important;
    background-color: var(--white) !important;
    &:hover {
      border: 1px solid var(--primary-blue) !important;
      color: var(--primary-blue) !important;
    }
    &:active{
      border: 1px solid var(--primary-blue) !important;
      color: var(--primary-blue) !important;
    }
  }

  a:hover {
    font-weight: bold;
  }

  .bold{
    font-weight: 700;
  }
  
  .italics{
    font-style: italic;
  }

  .DateInput_input {
    font-size: 1.4rem;
    line-height: 1.4rem;
    padding: 0.4rem 1rem;
  }

  .DateInput {
    width: 11rem;
  }

`;

const ContainerEl = styled.div`
  width: 100%;
  max-width: 128rem;
  margin: 0rem auto 1rem auto;
`;

const HeadContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ToggleContainer = styled.div`
  height: 5.2rem;
  border: 2px solid #000;
  display: flex;
`;

interface ToggleDataType {
  selected: boolean;
}

const ToggleEl = styled.div<ToggleDataType>`
  font-size: 1.6rem;
  font-weight: 600;
  padding: 1rem 2rem;
  align-items: center;
  text-transform: uppercase;
  color: ${(props) => (props.selected ? 'var(--white)' : 'var(--black-700)')};
  cursor: pointer;
  background-color: ${(props) => (props.selected ? 'var(--primary-blue)' : 'var(--white)')};  
  &:hover {
    background-color: ${(props) => (props.selected ? 'var(--primary-blue)' : 'var(--blue-very-light)')}; 
    color: ${(props) => (props.selected ? 'var(--white)' : 'var(--primary-blue)')}; 
  }
`;

const ButtonEl = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  padding: 1rem 2rem;
  align-items: center;
  text-transform: uppercase;
  color: var(--black-700);
  cursor: pointer;
  background-color: var(--white);  
  &:hover {
    background-color: var(--blue-very-light); 
    color: var(--primary-blue); 
  }
  height: 5.2rem;
  border: 2px solid #000;
  margin-right: 2rem;
`;

const METHODOLOGYLINK = process.env.NODE_ENV !== 'production' ? './data/' : 'https://data.undp.org/gender-social-media-monitoring-viz-v3/data/';

const App = () => {
  const [country, setCountry] = useState('Uganda');
  return (
    <>
      <GlobalStyle />
      <ContainerEl>
        <HeadContainer>
          <ToggleContainer>
            <ToggleEl selected={country === 'Colombia'} onClick={() => { setCountry('Colombia'); }}>Colombia</ToggleEl>
            <ToggleEl selected={country === 'Philippines'} onClick={() => { setCountry('Philippines'); }}>Philippines</ToggleEl>
            <ToggleEl selected={country === 'Uganda'} onClick={() => { setCountry('Uganda'); }}>Uganda</ToggleEl>
          </ToggleContainer>
          <a href={`${METHODOLOGYLINK}Methodology_UNDP Gender Social Media Monitoring.pdf`} target='_blank' rel='noreferrer'><ButtonEl>Methodology</ButtonEl></a>
        </HeadContainer>
      </ContainerEl>
      <MainArea
        country={country}
      />
    </>
  );
};

export default App;
