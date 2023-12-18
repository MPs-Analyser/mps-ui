import { useEffect, useState } from 'react';

import * as React from 'react'

import "./styles/browse.css";

import MpCard from './MpCard';
import DivisionCard from './DivisionCard';
import DivisionCardSkeleton from './DivisionCardSkeleton';
import MpCardSkeleton from './MpCardSkeleton';

import { PARTY_NAMES } from "./config/constants";

import { config } from './app.config';

import { VOTING_CATEGORIES } from "./config/constants";

import ky from 'ky-universal';

const types = [
  "MP",
  "Division"
]

const mpSortBy = [
  "Total Votes",
  "Voted Aye Count",
  "Voted No Count",
  "Time Served",
  "Name",
  "Party"
]

const mpFilterTypeKeys = [
  "Party",
  "Sex",
  "Year",
  "Votes"
]
const divisionFilterTypeKeys = [
  "Category",
  "Year"
]

const mpFilterTypeValues = {
  Party: PARTY_NAMES,
  Sex: ["Any", "M", "F"],
  Year: ["Any", 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
  Votes: ["Any", "> 100", "> 200", "> 300", "> 400", "> 500", "> 600", "> 700", "> 800", "> 900", "> 1000"]
}

const divisionFilterTypeValues = {
  Category: VOTING_CATEGORIES,
  Year: ["Any", 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
}

const divisionSortBy = [
  "Title",
  "Voted Aye Count",
  "Voted No Count",
  "Total Votes",
  "Date"
]

const skeletonArray = Array.from({ length: 100 }, (_, index) => index);


const Browse = ({ onQueryDivision, onQueryMp }) => {

  //toolbar options
  const [type, setType] = useState("MP");
  const [sortBy, setSortBy] = useState("Name");
  const [sortDirection, setSortDirection] = useState("ASC");
  const [name, setName] = useState("");

  const [filterTypeOptions, setFilterTypeOptions] = useState(mpFilterTypeValues[mpFilterTypeKeys[0]]);
  const [filterTypeKey, setFilterTypeKey] = useState(mpFilterTypeKeys[0]);
  const [filterTypeValue, setFilterTypeValue] = useState("Any");
  const [filterTypeKeys, setFilterTypeKeys] = useState(mpFilterTypeKeys);

  //mps
  const [mps, setMps] = useState();
  const [filteredMps, setFilteredMps] = useState();

  //divisions
  const [divisions, setDivisions] = useState();
  const [filteredDivisions, setFilteredDivisions] = useState();

  const onSearchMps = async ({ party = "Any" }) => {
    console.log("onSearchMps ", filterTypeValue);
    console.log("party ", party);

    let paramKey = filterTypeKey;
    let paramValue = filterTypeValue;
    if (filterTypeKey.endsWith(":")) {
      paramKey = filterTypeKey.slice(0, -1);
    }
    if (filterTypeKey === "Year:" && filterTypeValue === "Any") {
      paramValue = 0
    }



    setDivisions(undefined);
    setFilteredDivisions(undefined);
    console.log("call 1");
    let url = `${config.mpsApiUrl}searchMps?${paramKey.toLowerCase()}=${paramValue}`;

    if (name) {
      url = `${url}&name=${name}`
    }

    // if (filterTypeKey !== "Party") {
    //   url = `${url}&${filterTypeKey}=${filterTypeValue}`
    // }

    const result = await ky(url).json();

    setMps(result);
    setFilteredMps(result);
  };


  const onSearchDivisions = async ({ category = filterTypeValue }) => {
    setMps(undefined);
    setFilteredMps(undefined);

    let url = `${config.mpsApiUrl}searchDivisions?category=${category}`;
    if (name) {
      url = `${url}&name=${name}`
    }

    const result = await ky(url).json();

    setDivisions(result);
    setFilteredDivisions(result);
  }

  useEffect(() => {
    console.log("render Browse.jsx");

    const onSearchAllMps = async () => {

      setDivisions(undefined);
      setFilteredDivisions(undefined);

      let url = `${config.mpsApiUrl}searchMps?party=Any`;

      const result = await ky(url).json();

      setMps(result);
      setFilteredMps(result);
    };


    //get all mps 
    onSearchAllMps();

  }, []);


  const onChangeType = (value) => {

    setType(value);
    setFilterTypeValue("Any")

    if (value !== type) {
      if (value === 'MP') {

        setFilterTypeKeys(mpFilterTypeKeys);
        setFilterTypeKey(mpFilterTypeKeys[0])
        setFilterTypeOptions(mpFilterTypeValues[mpFilterTypeKeys[0]])

        onSearchMps({ party: "Any" });
        setSortBy("Name");
      } else {

        setFilterTypeKeys(divisionFilterTypeKeys);
        setFilterTypeKey(divisionFilterTypeKeys[0])
        setFilterTypeOptions(divisionFilterTypeValues[divisionFilterTypeKeys[0]])
        console.log("set to ", divisionFilterTypeValues[divisionFilterTypeKeys[0]]);
        onSearchDivisions({ category: "Any" });
        setSortBy("Title");
      }
    }
  }

  const onChangeMpParty = async (value) => {

    if (value !== filterTypeValue) {
      setMps(undefined);
      setFilteredMps(undefined);

      let url = `${config.mpsApiUrl}searchMps?party=${value}`;
      if (name) {
        url = `${url}&name=${name}`
      }

      const result = await ky(url).json();

      setMps(result);
      setFilteredMps(result);

    }
  }

  const onChangeMpSex = async (value) => {

    if (value !== filterTypeValue) {
      setMps(undefined);
      setFilteredMps(undefined);

      let url = `${config.mpsApiUrl}searchMps?sex=${value}`;
      if (name) {
        url = `${url}&name=${name}`
      }

      const result = await ky(url).json();

      setMps(result);
      setFilteredMps(result);

    }
  }

  const onChangeMpYear = async (value) => {

    if (value !== filterTypeValue) {
      setMps(undefined);
      setFilteredMps(undefined);

      let url = `${config.mpsApiUrl}searchMps?year=${value === "Any" ? 0 : value}`;
      if (name) {
        url = `${url}&name=${name}`
      }

      const result = await ky(url).json();

      setMps(result);
      setFilteredMps(result);

    }
  }

  const onChangeMpVotes = async (value) => {

    if (value !== filterTypeValue) {
      setMps(undefined);
      setFilteredMps(undefined);

      let url = `${config.mpsApiUrl}searchMps?votes=${value === "Any" ? 0 : value}`;
      if (name) {
        url = `${url}&name=${name}`
      }

      const result = await ky(url).json();

      setMps(result);
      setFilteredMps(result);

    }
  }

  const onChangeDivisionCategory = async (value) => {

    setDivisions(undefined);
    setFilteredDivisions(undefined);

    let url = `${config.mpsApiUrl}searchDivisions?category=${value}`;
    if (name) {
      url = `${url}&name=${name}`
    }

    const result = await ky(url).json();

    setDivisions(result);
    setFilteredDivisions(result);

  }

  const compareDates = (date1, date2) => {

    // Compare years
    if (date1.year.low !== date2.year.low) {
      return date1.year.low - date2.year.low;
    }

    // Compare months
    if (date1.month.low !== date2.month.low) {
      return date1.month.low - date2.month.low;
    }

    // Compare days
    return date1.day.low - date2.day.low;
  }

  const onChangeSortBy = (value, direction = sortDirection) => {

    console.log("onChangeSortBy ", type, value, direction);

    setSortBy(value);

    let result;

    if (type === "MP") {

      if (value === "Name") {

        if (direction === "ASC") {
          result = [...mps].sort((a, b) => a.name > b.name);
        } else {
          result = [...mps].reverse((a, b) => a.name > b.name);
        }
        setFilteredMps(result);

      } else if (value === "Party") {

        if (direction === "ASC") {
          result = [...mps].sort((a, b) => a.party > b.party);
        } else {
          result = [...mps].reverse((a, b) => a.party > b.party);
        }
        setFilteredMps(result);

      } else if (value === "Time Served") {
        if (direction === "ASC") {
          result = [...mps].sort((a, b) => compareDates(a.startDate, b.startDate));
        } else {
          result = [...mps].sort((a, b) => compareDates(b.startDate, a.startDate));
        }
        setFilteredMps(result);
      } else if (value === "Total Votes") {
        if (direction === "ASC") {
          result = [...mps].sort((a, b) => a.totalVotes - b.totalVotes);
        } else {
          result = [...mps].sort((a, b) => b.totalVotes - a.totalVotes);
        }
        setFilteredMps(result);
      } else if (value === "Voted Aye Count") {
        if (direction === "ASC") {
          result = [...mps].sort((a, b) => a.ayeVotes - b.ayeVotes);
        } else {
          result = [...mps].sort((a, b) => b.ayeVotes - a.ayeVotes);
        }
        setFilteredMps(result);
      } else if (value === "Voted No Count") {
        if (direction === "ASC") {
          result = [...mps].sort((a, b) => a.noVotes - b.noVotes);
        } else {
          result = [...mps].sort((a, b) => b.noVotes - a.noVotes);
        }
        setFilteredMps(result);
      }


    } else {

      if (value === "Title") {
        if (direction === "ASC") {
          result = [...divisions].sort((a, b) => a.title > b.title);
        } else {
          result = [...divisions].reverse((a, b) => a.title > b.title);
        }
        setFilteredDivisions(result);
      } else if (value === "Voted Aye Count") {

        if (direction === "ASC") {
          result = [...divisions].sort((a, b) => a.ayeCount - b.ayeCount);
        } else {
          result = [...divisions].sort((a, b) => b.ayeCount - a.ayeCount);
        }
        console.log("go  ", result);
        setFilteredDivisions(result);

      } else if (value === "Voted No Count") {
        if (direction === "ASC") {
          result = [...divisions].sort((a, b) => a.noCount - b.noCount);
        } else {
          result = [...divisions].sort((a, b) => b.noCount - a.noCount);
        }
        setFilteredDivisions(result);
      } else if (value === "Total Votes") {
        if (direction === "ASC") {
          result = [...divisions].sort((a, b) => (a.noCount + a.ayeCount) - (b.noCount + b.ayeCount));
        } else {
          result = [...divisions].sort((a, b) => (b.noCount + b.ayeCount) - (a.noCount + a.ayeCount));
        }
        setFilteredDivisions(result);
      } else if (value === "Date") {
        if (direction === "ASC") {
          result = [...divisions].sort((a, b) => compareDates(a.date, b.date));
        } else {
          result = [...divisions].sort((a, b) => compareDates(b.date, a.date));
        }
        setFilteredDivisions(result);
      }
    }
  }

  const onToggleSortDirection = () => {
    const newDirection = sortDirection === "ASC" ? "DESC" : "ASC";
    setSortDirection(newDirection);
    onChangeSortBy(sortBy, newDirection);
  }

  const onChangeFilterTypeKey = (value) => {
    const key = value.slice(0, -1);
    setFilterTypeKey(value);

    if (type === "MP") {
      setFilterTypeOptions(mpFilterTypeValues[key]);
    } else {
      setFilterTypeOptions(divisionFilterTypeValues[key]);
    }
  }

  const onChangeDivisionYear = async (value) => {

    setDivisions(undefined);
    setFilteredDivisions(undefined);

    const result = await ky(`${config.mpsApiUrl}searchDivisions?year=${value}`).json();

    setDivisions(result);
    setFilteredDivisions(result);

  }

  const onChangeFilterTypeValue = (value) => {
    console.log("onChangeMpFilterTypeValue ", type, filterTypeKey, value);
    setFilterTypeValue(value);

    if (type === "MP") {
      if (filterTypeKey === "Party") {
        onChangeMpParty(value);
      } else if (filterTypeKey === "Sex:") {
        onChangeMpSex(value);
      } else if (filterTypeKey === "Year:") {
        onChangeMpYear(value);
      } else if (filterTypeKey === "Votes:") {
        onChangeMpVotes(value);
      }
    } else {
      if (filterTypeKey === "Category") {
        onChangeDivisionCategory(value);
      } else if (filterTypeKey === "Year:") {
        onChangeDivisionYear(value);
      } else {
        console.log("unknown div type ", filterTypeKey);
      }
    }
  }

  return (

    <div className="browse">

      <div className="browse__toolbar">

        <div className="browse__toolbar__inputwrapper">
          <label
            htmlFor="type"
          >
            <span className='labelWrapper'>
              {type === "MP" && (
                <svg
                  className="votingHistory__table-svg selecticon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2c2.757 0 5 2.243 5 5.001 0 2.756-2.243 5-5 5s-5-2.244-5-5c0-2.758 2.243-5.001 5-5.001zm0-2c-3.866 0-7 3.134-7 7.001 0 3.865 3.134 7 7 7s7-3.135 7-7c0-3.867-3.134-7.001-7-7.001zm6.369 13.353c-.497.498-1.057.931-1.658 1.302 2.872 1.874 4.378 5.083 4.972 7.346h-19.387c.572-2.29 2.058-5.503 4.973-7.358-.603-.374-1.162-.811-1.658-1.312-4.258 3.072-5.611 8.506-5.611 10.669h24c0-2.142-1.44-7.557-5.631-10.647z" />
                </svg>
              )}
              {type === "Division" && (
                <svg
                  className="votingHistory__table-svg selecticon"
                  width="20"
                  height="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.052 19.001l.051.002.051.003.05.004.051.006.05.007.049.008.049.01.049.01.048.012.048.013.047.014.046.015.047.016.045.018.045.018.045.02.044.02.043.022.043.022.043.024.041.025.041.025.04.027.04.027.039.028.038.03.037.03.037.031.036.032.035.032.034.034.034.034.032.035.032.036.031.037.03.037.03.038.028.039.027.04.027.04.025.041.025.041.024.043.022.042.022.044.02.044.02.045.018.045.018.045.016.047.015.046.014.047.013.048.012.048.01.049.01.049.008.049.007.05.006.051.004.05.003.051.002.051.001.052v1h1v2h-13v-2h1v-1l.001-.052.002-.051.003-.051.004-.05.006-.051.007-.05.008-.049.01-.049.01-.049.012-.048.013-.048.014-.047.015-.046.016-.047.018-.045.018-.045.02-.045.02-.044.022-.044.022-.042.024-.043.025-.041.025-.041.027-.04.027-.04.028-.039.03-.038.03-.037.031-.037.032-.036.032-.035.034-.034.034-.034.035-.032.036-.032.037-.031.037-.03.038-.03.039-.028.04-.027.04-.027.041-.025.041-.025.043-.024.043-.022.043-.022.044-.02.045-.02.045-.018.045-.018.047-.016.046-.015.047-.014.048-.013.048-.012.049-.01.049-.01.049-.008.05-.007.051-.006.05-.004.051-.003.051-.002.052-.001h7l.052.001zm-7.039 1.999h-.013v1h7v-1h-6.987zm9.356-20.999l.05.001.05.003.049.005.049.005.049.007.049.007.048.009.048.011.048.011.047.012.047.014.046.014.046.016.046.017.045.018.045.019.044.021.044.021.043.022.043.024.042.025.041.025.041.027.041.028.039.029.039.029.039.031.038.032.037.033.036.034.036.035 4.949 4.949.035.036.034.036.033.038.032.037.031.039.03.039.029.04.027.04.027.042.026.041.024.042.024.043.022.043.022.044.02.044.019.045.018.045.017.046.016.046.015.046.013.047.012.047.012.048.01.048.009.048.007.049.007.048.005.049.005.05.003.049.001.05.001.05-.001.061-.003.061-.004.06-.006.06-.008.059-.01.058-.011.058-.013.057-.015.056-.016.056-.018.055-.019.054-.02.053-.023.053-.023.051-.025.051-.027.05-.027.05-.029.048-.031.047-.031.046-.033.046-.034.044-.036.044-.036.042-.038.041-.038.041-.04.039-.041.038-.041.037-.043.035-.044.035-.044.033-.046.032-.046.031-.047.029-.049.029-.048.027-.05.025-.05.024-.051.023-.052.021-.052.02-.053.019-.054.017-.054.016-.054.014-.056.012-.055.011-.056.009-.057.008-.057.006-.057.005-.057.003-.058.001-.058-.001-.059-.002-.058-.004-.059-.006-.059-.008-.059-.009-.059-.012-.06-.013-.059-.015-1.219 1.22 2.099 1.947 1.696 1.57 1.33 1.229 1.003.924.714.656.463.424.249.227.075.068.05.051.049.052.047.053.045.054.045.055.042.056.041.056.04.057.038.058.037.059.035.059.034.06.032.061.031.061.028.062.028.063.026.063.024.064.023.064.02.065.02.065.018.066.016.066.014.067.013.067.011.067.009.068.008.067.006.069.005.068.002.069.001.069-.001.073-.003.072-.005.072-.006.071-.009.071-.011.07-.012.07-.014.069-.016.069-.017.068-.02.068-.021.066-.022.067-.025.065-.026.065-.027.064-.029.063-.031.062-.032.061-.034.061-.035.06-.036.059-.038.057-.04.057-.041.056-.042.055-.043.054-.045.052-.046.052-.047.05-.049.05-.05.048-.05.047-.052.045-.054.045-.054.043-.055.042-.057.04-.057.039-.058.038-.06.036-.06.035-.061.034-.063.031-.063.031-.063.028-.065.028-.066.025-.066.024-.067.023-.068.02-.068.019-.069.017-.07.016-.071.013-.071.012-.071.01-.073.008-.072.006-.074.005-.073.002h-.074l-.075-.001-.075-.004-.063-.005-.062-.006-.062-.007-.062-.009-.062-.011-.061-.012-.061-.013-.061-.015-.06-.017-.06-.018-.06-.019-.059-.021-.059-.022-.059-.024-.058-.025-.058-.026-.057-.028-.057-.03-.056-.031-.056-.032-.056-.033-.055-.035-.054-.037-.054-.037-.054-.039-.053-.041-.052-.042-.052-.043-.051-.044-.051-.046-.05-.047-.049-.049-.042-.044-.075-.082-.241-.269-.349-.392-.437-.495-1.071-1.216-1.213-1.38-1.213-1.381-1.068-1.218-1.133-1.292-1.313 1.312.015.061.013.061.011.061.009.06.007.061.006.06.003.059.002.06.001.059-.002.059-.003.058-.005.058-.006.058-.009.057-.009.056-.012.056-.012.056-.015.055-.016.054-.017.054-.019.053-.02.052-.022.052-.023.051-.025.05-.026.049-.027.049-.028.048-.03.046-.031.047-.032.045-.034.044-.035.043-.035.042-.037.042-.039.04-.039.039-.04.038-.041.037-.043.036-.043.035-.045.033-.045.033-.046.031-.047.029-.048.029-.049.027-.05.026-.051.024-.051.023-.053.022-.053.02-.053.019-.055.017-.055.016-.056.014-.056.013-.057.011-.058.009-.058.008-.059.006-.059.004-.06.003-.06.001-.05-.001-.05-.002-.05-.003-.05-.004-.049-.005-.049-.007-.048-.008-.049-.009-.048-.01-.047-.011-.047-.013-.047-.014-.047-.014-.046-.016-.045-.017-.045-.018-.045-.019-.044-.021-.044-.021-.043-.022-.043-.024-.042-.025-.041-.025-.041-.027-.041-.028-.039-.029-.04-.029-.038-.031-.038-.032-.037-.033-.036-.034-.036-.035-4.949-4.948-.004-.004-.035-.036-.033-.036-.033-.038-.032-.038-.031-.038-.029-.039-.029-.04-.028-.041-.026-.041-.026-.041-.024-.042-.023-.043-.023-.043-.021-.043-.02-.045-.019-.044-.018-.045-.017-.046-.015-.045-.015-.047-.013-.046-.013-.047-.011-.048-.01-.047-.009-.048-.008-.049-.006-.048-.005-.049-.005-.049-.003-.05-.001-.049-.001-.05.001-.05.001-.049.003-.05.004-.049.006-.049.006-.049.008-.048.009-.048.01-.048.011-.047.012-.047.014-.047.014-.047.016-.046.017-.045.018-.045.019-.045.02-.044.021-.044.023-.043.023-.043.025-.042.025-.042.027-.041.028-.04.029-.04.029-.04.031-.038.032-.038.033-.038.034-.036.035-.036.051-.049.052-.047.054-.045.054-.042.055-.041.056-.038.058-.036.058-.034.058-.032.06-.029.06-.028.061-.025.061-.023.062-.021.062-.019.063-.017.063-.015.063-.013.063-.01.064-.009.064-.006.063-.005.064-.002.064-.001.063.002.064.004.063.005.063.008.063.009.062.012.062.013.061.016 5.679-5.679-.016-.062-.013-.063-.012-.063-.01-.063-.007-.064-.006-.064-.003-.064-.002-.064.001-.064.003-.064.004-.064.007-.063.009-.064.011-.063.013-.063.015-.063.017-.063.019-.062.021-.061.023-.061.025-.06.028-.06.029-.059.032-.058.033-.057.036-.057.038-.055.04-.055.042-.053.044-.053.046-.051.048-.05.036-.035.036-.034.037-.033.038-.032.039-.031.039-.03.04-.029.04-.028.041-.027.042-.025.042-.025.043-.024.043-.022.044-.022.044-.02.045-.019.045-.018.046-.017.046-.016.046-.015.047-.013.047-.013.048-.011.048-.01.048-.009.049-.008.049-.007.049-.005.049-.005.05-.003.05-.001.05-.001.05.001zm-5.349 8.712l3.536 3.537 1.773-1.774 1.107 1.211 2.532 2.775 1.432 1.57 1.345 1.478.594.654.518.571.421.466.308.343.028.032.029.032.031.031.033.029.034.029.035.027.037.026.038.024.038.023.04.02.04.018.041.016.041.013.042.01.021.004.021.003.021.002.021.002.027.001.026.001.025-.001.025-.001.024-.003.024-.002.024-.004.023-.004.044-.011.041-.012.04-.015.037-.016.035-.017.033-.018.03-.019.029-.019.025-.019.024-.019.021-.018.018-.017.029-.028.027-.029.026-.031.023-.031.023-.032.02-.033.018-.034.017-.035.015-.035.013-.035.011-.037.009-.036.008-.037.005-.037.003-.038.001-.037-.001-.038-.003-.039-.005-.038-.007-.037-.009-.037-.011-.037-.014-.037-.015-.036-.016-.035-.019-.035-.021-.034-.022-.034-.025-.034-.026-.032-.028-.033-.03-.031-.078-.07-.041-.034-.024-.02-.016-.015-.189-.174-.217-.202-.242-.226-.265-.25-.591-.559-.656-.625-.705-.674-.735-.705-.748-.719-.744-.717-1.405-1.356-1.177-1.138-1.11-1.076 1.634-1.635-3.537-3.536-3.882 3.884zm-1.415 1.415l-1.411.003-.001.001 4.947 4.946.001-1.413-3.535-3.537h-.001zm6.714-6.716l-.002.003 3.536 3.536.002-.002 1.412-.002-4.948-4.948v1.413z" />
                </svg>
              )}
              {type === "MP" && filteredMps && filteredMps.length}
              {type === "Division" && filteredDivisions && filteredDivisions.length}
            </span>

          </label>
          <select
            className='select'
            name="type"
            value={type}
            onChange={(e) => onChangeType(e.target.value)}
          >
            {types.map(type => (
              <option value={type} key={type}>{`${type}'s`}</option>
            ))}
          </select>
        </div>

        {/* <div className="browse__toolbar__inputwrapper">
          <label htmlFor="prominance">Prominance:</label>
          <select name="prominance">
            <option>Time Served</option>
            <option>Total votes</option>
          </select>
        </div> */}

        {/* {type === "MP" && ( */}
        <div className="browse__toolbar__inputwrapper">

          <select
            htmlFor="filtervalue"
            className='select'
            style={{ position: "relative", left: -4, marginRight: -12, width: 83, borderRadius: "10px 0 0 10px" }}
            name="filtertype"
            value={filterTypeKey}
            onChange={(e) => onChangeFilterTypeKey(e.target.value)}
          >
            {filterTypeKeys.map(i => <option disabled={i === "Votes"} key={i}>{i}:</option>)}
          </select>

          <select
            className='select'
            style={{ borderRadius: "0 10px 10px 0" }}
            name="filtervalue"
            value={filterTypeValue}
            onChange={(e) => onChangeFilterTypeValue(e.target.value)}
          >
            {filterTypeOptions && filterTypeOptions.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
        {/* )} */}

        {/* {type === "Division" && (
          <div className="browse__toolbar__inputwrapper">
            <label htmlFor="category">Category:</label>
            <select
              className='select'
              name="party"
              value={category}
              onChange={(e) => onChangeCategory(e.target.value)}
            >
              {VOTING_CATEGORIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        )} */}

        <div className="browse__toolbar__inputwrapper">
          <label htmlFor="party">{type === "MP" ? "Name" : "Title"}:</label>
          <input
            type="search"
            title="name"
            placeholder={type === "MP" ? 'filter by MP name' : 'filter by division title'}
            className='input'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className='button iconbutton' onClick={type === "MP" ? onSearchMps : onSearchDivisions}>
            Apply
          </button>
        </div>

        <div className="browse__toolbar__inputwrapper">

          <label htmlFor="soryBy">Sort:</label>
          <select
            className='select'
            name="sortBy"
            value={sortBy}
            onChange={(e) => onChangeSortBy(e.target.value)}
          >
            {type === "MP" && mpSortBy.map(i => <option key={i} value={i}>{i}</option>)}
            {type === "Division" && divisionSortBy.map(i => <option key={i} value={i}>{i}</option>)}

          </select>

          <button className='button iconbutton' onClick={onToggleSortDirection}>
            {sortDirection === "ASC" && (
              <svg
                className="standalone-svg"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24">
                <path d="M6 3l-6 8h4v10h4v-10h4l-6-8zm16 14h-8v-2h8v2zm2 2h-10v2h10v-2zm-4-8h-6v2h6v-2zm-2-4h-4v2h4v-2zm-2-4h-2v2h2v-2z" />
              </svg>
            )}

            {sortDirection === "DESC" && (
              <svg
                className="standalone-svg"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24">
                <path d="M6 21l6-8h-4v-10h-4v10h-4l6 8zm16-4h-8v-2h8v2zm2 2h-10v2h10v-2zm-4-8h-6v2h6v-2zm-2-4h-4v2h4v-2zm-2-4h-2v2h2v-2z" />
              </svg>
            )}

          </button>
        </div>

      </div>

      <div className="browse__grid">

        
        

        {type === "MP" && !filteredMps && skeletonArray.map(() => <MpCardSkeleton />)}        
        {type === "Division" && !filteredDivisions && skeletonArray.map(() => <DivisionCardSkeleton />)}


        {Boolean(mps && mps.length) && filteredMps.map(i => (
          <MpCard item={i} onQueryMp={onQueryMp} key={i.id} />
        ))}

        {Boolean(divisions && divisions.length) && filteredDivisions.map(i => (
          <DivisionCard item={i} onQueryDivision={onQueryDivision} key={i.id} />
        ))}

      </div>
    </div>
  )
}

export default Browse;
