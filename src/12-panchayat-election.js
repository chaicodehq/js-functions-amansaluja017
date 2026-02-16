/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  // Your code here

  const votes = {};
  const registeredVoters = [];

  function registerVoter(voter) {
    if (
      typeof voter !== "object" ||
      voter === null ||
      !voter.name ||
      !voter.age ||
      !voter.id ||
      voter.age < 18
    )
      return false;

    if (
      registeredVoters.findIndex(
        (registerVoter) => registerVoter.id === voter.id,
      ) !== -1
    )
      return false;

    registeredVoters.push(voter);
    return true;
  }

  function castVote(voterId, candidateId, onSuccess, onError) {
    if (
      registeredVoters.findIndex(
        (registerVoter) => registerVoter.id === voterId,
      ) !== -1 &&
      candidates.findIndex((cadidate) => cadidate.id === candidateId) !== -1 &&
      !Object.keys(votes).includes(voterId)
    ) {
      votes[voterId] = candidateId;
      return onSuccess({ voterId, candidateId });
    } else {
      return onError(
        "voterid id not registered or cadidate not found or voter is already cast",
      );
    }
  }

  function getResults(sortFn) {
    const results = [];
    candidates.reduce((_, curr) => {
      const totalVotes = Object.values(votes).filter(
        (vote) => vote === curr.id,
      );
      const voteCount = {
        id: curr.id,
        name: curr.name,
        party: curr.party,
        votes: totalVotes.length,
      };

      results.push(voteCount);
    }, {});

    return sortFn
      ? results.sort(sortFn)
      : results.sort((a, b) => b.votes - a.votes);
  }

  function getWinner() {
    if (!Object.keys(votes).length) return null;

    const winner = getResults();

    return winner[0];
  }

  return {
    registerVoter,
    castVote,
    getResults,
    getWinner,
  };
}

export function createVoteValidator(rules) {
  // Your code here
  if (typeof rules !== "object") return {};

  const response = { valid: false, reason: "" };

  return function (object) {
    for (const element of rules.requiredFields) {
      if (!Object.keys(object).includes(element)) {
        response.reason = "All fields are required!";
        return response;
      }
    }

    if (object.age < rules.minAge) {
      response.reason = "Age must be greater than 18";
      return response;
    }

    ((response.valid = true), (response.reason = "All good"));
    return response;
  };
}

export function countVotesInRegions(regionTree) {
  // Your code here
  if (typeof regionTree !== "object" || regionTree === null) return 0;

  return (
    regionTree.votes +
    regionTree.subRegions.reduce((acc, curr) => {
      if (curr.subRegions.length) {
        return acc + countVotesInRegions(curr);
      }
      return acc + curr.votes;
    }, 0)
  );
}

export function tallyPure(currentTally, candidateId) {
  // Your code here
  //
  if (typeof currentTally !== "object" || !candidateId) return {};

  const copyCurrentTally = { ...currentTally };

  Object.hasOwn(copyCurrentTally, candidateId)
    ? copyCurrentTally[candidateId]++
    : (copyCurrentTally[candidateId] = 1);

  return copyCurrentTally;
}
