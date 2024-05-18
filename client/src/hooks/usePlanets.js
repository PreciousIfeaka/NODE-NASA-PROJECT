import { useCallback, useEffect, useState } from "react";

import { httpGetPlanets } from "./requests.js";

function usePlanets() {
  const [planets, savePlanets] = useState([]);

  const getPlanets = useCallback(async () => {
    const fetchedPlanets = await httpGetPlanets();
    savePlanets(fetchedPlanets);
  }, []);

  useEffect(() => {
    getPlanets();
  }, [getPlanets]);

  console.log(planets);
  return planets;
}

export default usePlanets;
