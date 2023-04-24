import React, { useReducer, useState } from "react";
import "./styles.css";

import faker from "faker";

faker.seed(123);

const data = [...Array(50)].map((item) => ({
  id: faker.random.uuid(),
  name: faker.commerce.productName(),
  image: faker.random.image(),
  price: faker.commerce.price(),
  material: faker.commerce.productMaterial(),
  brand: faker.lorem.word(),
  inStock: faker.random.boolean(),
  fastDelivery: faker.random.boolean(),
  ratings: faker.random.arrayElement([1, 2, 3, 4, 5]),
  offer: faker.random.arrayElement([
    "Save 50",
    "70% bonanza",
    "Republic Day Sale"
  ]),
  idealFor: faker.random.arrayElement([
    "Men",
    "Women",
    "Girl",
    "Boy",
    "Senior"
  ]),
  level: faker.random.arrayElement([
    "beginner",
    "amateur",
    "intermediate",
    "advanced",
    "professional"
  ]),
  color: faker.commerce.color()
}));

function reducer(state, action) {
  switch (action.type) {
    case "searchData": {
      console.log("button Clicked");
      return { ...state, SearchValue: action.value };
    }
    case "Sort": {
      return { ...state, sort: action.value };
    }
    case "Out_of_Stock": {
      return { ...state, IncludeOutOfStock: action.value };
    }
    case "Fast_Delivery": {
      console.log(action.value);
      return { ...state, fastDelivery: action.value };
    }
    case "reset": {
      console.log(action.value);
      if (action.value === "SearchValue") {
        return { ...state, [action.value]: "" };
      }
      return { ...state, [action.value]: !action.value };
    }
    case "resetAll": {
      return {
        ...state,
        SearchValue: "",
        sort: null,
        IncludeOutOfStock: false,
        fastDeliveryOnly: true
      };
    }
    default:
      console.log("Defualt called");
      return state;
  }
}

export default function App() {
  const [searchValue, setSearchValue] = useState("");

  const [state, dispatch] = useReducer(reducer, {
    SearchValue: "",
    sort: null,
    IncludeOutOfStock: false,
    fastDeliveryOnly: true
  });

  console.log(state);
  let DataToShow = data.filter(({ name }) =>
    name.toLowerCase().includes(state.SearchValue.toLowerCase())
  );
  DataToShow = DataToShow.sort((a, b) =>
    state.sort === "Low_To_High" ? a.price - b.price : b.price - a.price
  );
  DataToShow = DataToShow.filter(({ fastDelivery }) =>
    state.fastDelivery ? fastDelivery : true
  );
  DataToShow = DataToShow.filter(({ inStock }) =>
    state.IncludeOutOfStock ? true : inStock
  );
  console.log(Object.entries(state));

  return (
    <>
      <div className="FilterSelection">
        {/* //Search Item */}
        <label>
          Search:
          <input
            type="text"
            value={searchValue}
            placeholder="Search Data"
            onChange={(e) => setSearchValue(e.target.value)}
          ></input>
          <button
            onClick={(event) =>
              dispatch({ type: "searchData", value: searchValue })
            }
          >
            Search Data
          </button>
        </label>

        {/* Sort By */}
        <fieldset>
          <legend>Sort By:</legend>
          <label>
            <input
              type="radio"
              name="sort"
              checked={state.sort === "Low_To_High"}
              value="Low_To_High"
              onClick={(e) => dispatch({ type: "Sort", value: "Low_To_High" })}
            />
            Low To High
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              checked={state.sort === "High_To_Low"}
              value="High_To_Low"
              onClick={(e) => dispatch({ type: "Sort", value: "High_To_Low" })}
            />
            High to Low
          </label>
        </fieldset>

        {/* Filter */}
        <fieldset>
          <legend>Filter</legend>
          <label>
            <input
              type="checkBox"
              checked={state.IncludeOutOfStock}
              name="filter"
              value="outStock"
              onClick={(e) =>
                dispatch({ type: "Out_of_Stock", value: e.target.checked })
              }
            />
            Include Out Of Stock
          </label>
          <label>
            <input
              type="checkBox"
              name="filter"
              value="fastDelivery"
              checked={state.fastDeliveryOnly}
              onClick={(e) =>
                dispatch({ type: "Fast_Delivery", value: e.target.checked })
              }
            />
            Fast Delivery
          </label>
        </fieldset>
      </div>

      <div className="Applied_Filter">
        Applied Filter:
        {Object.entries(state)
          .filter(([type, value]) => (value ? true : false))
          .map(([type, value]) => (
            <div
              style={{
                display: "inline-block",
                border: "1px solid black",
                borderRadius: "15px",
                padding: "5px",
                backgroundColor: "#E5E3E2"
              }}
            >
              <span>
                {type}({value})
              </span>
              <button
                style={{ border: "none", backgroundColor: "#E5E3E2" }}
                onClick={() => dispatch({ type: "reset", value: type })}
              >
                X
              </button>
            </div>
          ))}
      </div>

      <div className="App" style={{ display: "flex", flexWrap: "wrap" }}>
        {(DataToShow.length === 0 && <h2>No Item Found</h2>) ||
          DataToShow.map(
            ({
              id,
              name,
              image,
              price,
              productName,
              inStock,
              level,
              fastDelivery
            }) => (
              <div
                key={id}
                style={{
                  border: "1px solid #4B5563",
                  borderRadius: "0 0 0.5rem 0.5rem",
                  margin: "1rem",
                  maxWidth: "40%",
                  padding: "0 0 1rem"
                }}
              >
                <img src={image} width="100%" height="auto" alt={productName} />
                <h3> {name} </h3>
                <div>Rs. {price}</div>
                {inStock && <div> In Stock </div>}
                {!inStock && <div> Out of Stock </div>}
                <div>{level}</div>
                {fastDelivery ? (
                  <div> Fast Delivery </div>
                ) : (
                  <div> 3 days minimum </div>
                )}
              </div>
            )
          )}
      </div>
    </>
  );
}
