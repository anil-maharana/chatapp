
//App.js
import { useState, useEffect } from "react";
import axios from "axios";

const DemoLoading = () => {
  //we change here
  const [Items, setItems] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  //setting tha initial page
  const [page, setPage] = useState(0);
  //we need to know if there is more data
  const [HasMore, setHasMore] = useState(true);

  //on initial mount
  useEffect(() => {
    loadMoreItems();
  }, []);

  function loadMoreItems() {
    setIsFetching(true);

    //using axios to access the third party API
    axios({
      method: "GET",
      url: "http://localhost:8080/api/chats",
      params: { _page: page, _limit: 20 },
    })
      .then((res) => {
        setItems((prevTitles) => {
          return [...new Set([...res.data.map((b) => b.message),...prevTitles])];

          //return([res.data, prevTitles])
        });
        setPage((prevPageNumber) => prevPageNumber + 1);
        setHasMore(res.data.length > 0);
        setIsFetching(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <div>
      {isFetching && <p>Fetching items...</p>}
      {!isFetching && HasMore && (
        <button onClick={loadMoreItems}>Load more</button>
      )}
      {Items.map((item, index) => {
        if (Items.length === index + 1) {
          return (
            <div key={index}>
              {item} - <b>last</b>
            </div>
          );
        } else {
          return <div key={index}>{item}</div>;
        }
      })}
     
    </div>
  );
};

export default DemoLoading;
