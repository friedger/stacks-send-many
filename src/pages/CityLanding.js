import { currentCity, currentCityList } from '../store/common';
import NotFound from './NotFound';

export default function CityLanding(props) {
  // if found in list
  //   showCity
  // else
  //   showCityNotFound

  console.log(currentCityList);
  console.log(`citySymbol: ${props.citySymbol}`);

  var cityMatched = false;

  const cityListArray = Object.entries(currentCityList);
  cityListArray.map(([key, value]) => {
    console.log(`key: ${key} value: ${value}`);
    if (value.symbol.toLowerCase() === props.citySymbol.toLowerCase()) {
      cityMatched = true;
    }
  });

  if (cityMatched) {
    return <div>Found: {props.citySymbol.toLowerCase()}</div>;
  } else {
    return <NotFound />;
  }
}
