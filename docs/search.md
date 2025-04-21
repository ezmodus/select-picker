# Search

Use simple way or have even more customization for the large datasets.

All searches are case-insensitive (all is seen as lowercase).

- Direct matching, space is part of the search string
- Exclusion (not), space works as separator, (dominates over inclusion)
- Inclusion (or), space works as separator

**Notice:**

Picker itself does not offer help (in UI) how to use the search. Explaining how it works is left for the developer to inform.

```javascript
// Best way to describe how search works is through by examples.

// example list of names
list: [
    "Bruce Lee",
    "Bruce Wayne",
    "Bruce Willis",
    "Martha Kent",
    "Jonathan Kent",
    "Clark Kent",
    "Martha Wayne",
    "Thomas Wayne",
    "Abigail Lincoln",
    "Abraham Lincoln",
    "Lincoln Kent",
    "Abigail Whitehair",
];

// Simple - direct matching
search: "bruce"
// Find anything what matches word "bruce"
// Returns "Bruce Lee", "Bruce Wayne", "Bruce Willis"

search: "bruce w" // space does NOT work as separator
// Find anything what matches "bruce w"
// Returns "Bruce Wayne", "Bruce Willis"

search: "bruce-kent"
// Find anything what matches "bruce-kent"
// Returns nothing

// Advanced logic

// exclusion
// any word which starts with dash "-"
search: "lincoln -abigail"
// Find anything what matches "lincoln", but exclude if "abigail" is found
// returns "Abraham Lincoln", "Lincoln Kent"

// inclusion
// any word which starts with plus "+", think of it as "or"
search: "wayne +lincoln" // wayne or lincoln, space works as separator
// Find anything what matches "wayne" or "lincoln"
// returns "Bruce Wayne", "Martha Wayne", "Thomas Wayne", "Abigail Lincoln", "Abraham Lincoln", "Lincoln Kent"

// of course these works together
search: "bruce -willis +clark +abigail -lincoln"
// Find anything what matches "bruce" or "clark" or "abigail", but exclude if it includes "willis or "lincoln"
// Returns "Bruce Lee", "Bruce Wayne", "Clark Kent", "Abigail Whitehair"

// And if it wasn't clear enough, those (-|+) are separators so space works in search too
search: "bruce wayne +jonathan kent +abigail white"
// Find anything what matches "bruce wayne" or "jonathan kent" or "abigail white"
// Returns "Bruce Wayne", "Jonathan Kent", "Abigail Whitehair"
```

If `select` element has `optgroup` then also these work as groups and can be included or excluded.

```javascript
// group search strings are double + to include or double - to exclude
// pseudo data
list: {
    'American': [
        'Cadillac',
        'Chervolet',
        'Dodge',
        'Ford',
    ],
    'British': [
        'Alfa romeo',
        'Bentley',
        'Jaguar',
    ],
}
search: "a --am"
// This would only return items which has letter "a" in it, but excludes group which has "am" in it.
// This means that only return british values like "Alfa romeo" and "Jaguar".
```

---

[Back to README.md](../README.md)
