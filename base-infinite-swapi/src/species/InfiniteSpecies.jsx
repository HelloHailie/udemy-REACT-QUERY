import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import { useInfiniteQuery } from "@tanstack/react-query";

const initialUrl = "https://swapi.py4e.com/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["sw-species"],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => lastPage.next || undefined,
  });

  if (isLoading) return <div className='loading'>Loading...</div>;
  if (isError) return <div>{error.toString()}</div>;

  return (
    <>
      {isFetching && <div className='loading'>Loading...</div>}
      <InfiniteScroll
        pageStart={0}
        loadMore={() => {
          if (!isFetching) {
            fetchNextPage();
          }
        }}
        hasMore={hasNextPage}
        loader={
          <div className='loader' key={0}>
            Loading ...
          </div>
        }
      >
        {data.pages.map((page, index) => (
          <ul key={index}>
            {page.results.map((species) => (
              <Species
                key={species.name}
                name={species.name}
                language={species.language}
                averageLifespan={species.average_lifespan}
              />
            ))}
          </ul>
        ))}
      </InfiniteScroll>
    </>
  );
}
