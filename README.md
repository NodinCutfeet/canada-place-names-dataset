# canada-place-names-dataset

A dataset of 8,124 Canadian place names with French and Indigenous characters, provinces, coordinates, and First Nation identification. Includes a full metadata file for mapping, light GIS, and data enrichment/joins, plus a lightweight list for autocomplete and location-based UI tools. CC-BY licensed.

# Why This Dataset Was Built

I created this dataset because I could not find an openly licensed, usable list of Canadian communities that accurately reflected the names people actually use, especially Indigenous place names, which are often replaced in public datasets with outdated or colonial English labels that are unhelpful, misleading, or simply disrespectful.

Most existing datasets also fall short in other ways:

- Indigenous names are missing or anglicized, even when the English name is not used by the community.
- Small towns and remote communities are often excluded, despite their importance on regional scales.
- Quebec place names are inconsistently formatted, missing correct accents, hyphens, or full Saint or Sainte spellings.
- High resolution datasets are unusably noisy, containing thousands of "places" that are not settlements at all:
  - named highway intersections  
  - farm roads  
  - beaches, creeks, and shoals  
  - single houses at the end of a forest road  
  - administrative nodes or survey markers  

For front end applications, search bars, mapping tools, and data joining workflows, this noise makes the data nearly impossible to work with.

My goal was to build a dataset of places where people actually live, in a format suited for UI and UX needs.

## The Problem With Matching Canadian Placenames

The biggest challenge was reconciling conflicting or incomplete name formats. Many towns, especially in Quebec, appear under multiple widely different names across various sources. To give a made up English example:

- Saint Mathew  
- St Mathew of The Long River  
- Municipality of Saint Mathew  
- St. Mathew of Larger Nearby Town or Region Name shared by many towns  

These might share coordinates within a 5 km radius, but without authoritative cross references, resolving them correctly is extremely difficult. Data wrangling is my hobby, not my profession, so I opted for a conservative approach and prioritized correctness over aggressive merging.

When I experimented with more heavy handed matching rules, the dataset filled with natural features, traplines, and non settlements. So I rolled back to strict criteria to ensure the list stayed meaningful and practical. The limitation being, many Quebec towns under 1k people are not included. Fortunately, their neighboring towns 20 minutes away are included.

# What Each File Represents

### places-*.json

Contains:

- placename  
- province or territory  
- coordinates  
- isFirstNation boolean  

These files are ideal for mapping, data visualization, reference layers, and bridging datasets.

### names-*.json

Contains:

- lists of placenames grouped by province or territory  

These are optimized for front end web use such as autocomplete fields, search bars, and dropdown lists.

# Levels of Inclusion: Full List, Shortlist, and Microlist

This dataset includes three tiers:

- **Full List**: Every community, including hamlets and seasonal villages (except for errors in Quebec).
- **Shortlist**: Medium sized towns, popular weekend villages, and major population centres.
- **Microlist**: Only places with their own census population value, used as a proxy for national scale relevance.

Throughout all tiers, First Nations are always included. There are only 629 First Nations in Canada, and each is a distinct community socially, culturally, politically, and geographically. Remote Nations also play critical roles in their regions, often serving as transportation or service hubs.

And fundamentally:

Canada is 100 percent stolen Indigenous land, from coast to coast to coast. Taken through centuries of violence, forced child removal and abuse, manmade famine and broken treaties by nations that invested heavily in the technologies and logistics of war. These were imposed on Nations whose cultures prioritized stewardship of people, land, and water. Over thirteen thousand years of stewardship undone in two centuries. Including First Nations at every level of this dataset is the absolute minimum, and costs only a few extra kilobytes.

# Coverage Visualizer

This dataset includes an interactive tool called the **Coverage Visualizer**, built with Leaflet JS and OpenStreetMap tile layers. It provides a satellite and map based interface for exploring the data in detail.

The Coverage Visualizer allows you to:

- view every community as a point on the map  
- toggle between categories such as First Nations, shortlist matches, microlist matches, and excluded points  
- search for any community in the dataset  
- zoom in to inspect the exact coordinates used  
- inspect the nearest neighbor distances used for deduplication  
- regenerate all derived JSON files from a single master file  

The tool reads from **data.js**, which acts as the source of truth for the entire project. I strongly recommend making edits or additions to **data.js**, because the four derived JSON files can be quickly regenerated from it. This avoids needing to hand edit multiple files and keeps the dataset clean and reproducible.

### Screenshot

![Coverage Visualizer Screenshot](coverage-visualizer-screenshot.png)

# Limitations and Important Notes

Many small Quebec towns are missing due to difficulties separating their names from nearby communities and natural features. If you choose to restore these, I welcome contributions and would appreciate a pull request, but this is optional and not required.

Communities that share identical names within the same province are given a "near X" tag to avoid collisions (for example: Coastal Township (near Big City) vs. Coastal Township (near Large River)).

Large water bodies were preferred for "X" because they tend to have consistent names. Major population centres were used when one community was under 2 hours away and the other was over 4 hours away.

Some First Nations may use non Indigenous names in federal datasets, or may have been accidentally merged with nearby towns that are actually distinct communities. I corrected many of these, but a few mismatches likely remain.

A handful of non settlements may still be present. I manually removed most mistaken entries such as truck stops, isolated radar bases, seasonal hunting cabins, ice road islands, abandoned outposts, and remote industrial sites, but some probably remain.

I kept Alert, Nunavut because it is continuously inhabited and is simply too interesting to exclude.

# CC BY 4.0 Licensing

This dataset is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).

In short, CC BY allows anyone to:

- copy, redistribute, and host the dataset  
- modify it  
- remix it  
- build commercial or non commercial tools with it  

as long as proper attribution is provided.

## Not a Derivative of GeoNames

This dataset is not a derivative of GeoNames.

No GeoNames names, coordinates, metadata fields, or formatting were copied. GeoNames was used strictly as a filter to identify candidate settlements in Statistics Canada CC0 data. Every coordinate and every name in this repository originates from:

- Statistics Canada (CC0)  
- my own transformations and formatting  
- my own First Nations dataset  

Because no GeoNames data is reproduced here, the GeoNames license does not apply.

## What Counts as a Derivative

Under CC BY 4.0, any dataset that uses any of the exact names, formatting, coordinates, compiled structure, or selection from this dataset is considered a derivative work.

This includes but is not limited to:

- changing field names  
- removing fields  
- converting JSON to CSV  
- re sorting records  
- filtering out small towns  
- merging this with other datasets  
- building tools, apps, or visualizations  
- reusing records or subsets  
- embedding it in software or a database  

None of these actions remove the attribution requirement. If your dataset includes any record that comes from this one, whether one, one hundred, or all of them, your work is a derivative and must include attribution.

## How to Build a Non Derivative Dataset (If You Refuse Attribution)

If someone wants to avoid attribution entirely, they must do exactly what I did with GeoNames:

- use this dataset only as a filter or guide  
- re parse the official CC0 Statistics Canada source  
- reconstruct all naming, formatting, and coordinate selection independently  
- avoid copying my text, formatting, name variants, or coordinates, even partially  

That is the only way to produce a non derivative dataset under CC BY.

I do not own the names of towns, villages, or First Nations.  
But I do own:

- the specific formatting  
- the normalization rules  
- the curated selections  
- the combined structure  
- the corrections to placenames as a curated whole  
- the multi stage deduplication logic  
- the unique patterns created by my manual corrections  
- the contents of the "near" tags to avoid data collisions  

This dataset contains dozens of small, technically correct but distinctive formatting choices. Used together, these uniquely fingerprint the dataset. If your data reproduces these patterns, it is legally and practically a derivative work, regardless of intent.

## Required Attribution

If you use this dataset, whether modified, filtered, restructured, or embedded, please attribute as follows:

**Attribution:** Nodin Cutfeet  
**Link:** https://github.com/NodinCutfeet/canada-place-names-dataset or https://nodincutfeet.ca

### Placement Requirements

- Ideally: in the same element or screen where the data appears (for example, a credits footnote or dataset tooltip).  
- Acceptable: a Credits, Open Source, Legal, or About page, as long as that page is publicly accessible and indexable by search engines and AI crawlers.  
- If the legal or credits page is not indexable or is hidden, then attribution must appear wherever the data is displayed or used.

Attribution is small and unobtrusive, and costs nothing, just like the kilobytes needed to recognize Indigenous Nations on their own land.

# Data Provenance

This dataset is built on three external sources and a substantial amount of original work.

### 1. Statistics Canada (CC0, multiple datasets)

I originally processed several open StatsCan files in 2021 to make them more useful for visualization. These included:

- a national placename file that listed everything from tiny creeks to subdivision names  
- coordinate datasets for Canada Post and remote airstrips  
- First Nation band number lists with approximate coordinates  

StatsCan data has notable quirks:

- many remote communities are placed at airports or Canada Post depots rather than the community itself  
- Quebec names often lack proper accents or full Saint or Sainte forms  
- Indigenous communities frequently appear under English or colonial names not used locally  

The goal of this project was to repair those issues.

### 2. GeoNames CA.txt

Used strictly as a filter, never as a source of names or coordinates. GeoNames often contained outdated English names for First Nations, incorrect Quebec formatting, and placenames I had never heard used in communities I know well. None of the actual GeoNames text or coordinates are included here.

### 3. Phil Campbell's cities.txt

A compact, well curated list of small and medium sized towns. It uses anglicized names and contains no coordinates, but it is an excellent lightweight resource for simpler projects. It impressively captures places like Ignace, Ontario, small highway communities with only a few services, while still compressing down to a very small file size.

# Methodology Overview

## Summary

This dataset is built entirely from multiple files of CC0 Statistics Canada data, as well as placenames from Commission de toponymie du Quebec. No names, coordinates, or text from GeoNames or other non CC0 sources appear anywhere in the final files. GeoNames and data from Phil Campbell were used strictly as algorithmic filters to help identify which StatsCan entries represented real population centres, but none of their proprietary fields were stored, copied, or embedded.

Because the dataset contains zero GeoNames derived values, and every coordinate, name, and metadata field originates from CC0 sources or original work, this project is not a derivative database under Canadian, US, or European database rights frameworks. As a result, no GeoNames attribution is required, and the dataset may be shared and reused under the Creative Commons Attribution 4.0 license.

The result is an open, rigorously cleaned dataset of Canadian communities that is accurate, consistently formatted, free of copyright entanglements, and safe for any downstream use, including open source applications and commercial projects.

---

## 1. First Nations Data Preparation

**Goal:** Produce a complete, province tagged dataset of Indigenous communities.

- Loaded data from Indigenous Services Canada, which more frequently used the modern non English names for First Nations.  
- The source lacked province information, so an HTML tool cross referenced each entry with StatsCan placenames data using coordinate matching (including swapped column correction and band ID inference).  
- Verified matches using Haversine distance and flagged anything over 50 km.  
- Exported a cleaned and validated file of federally recognized First Nations.

## 2. Building the Non First Nation Master List

**Goal:** Extract legitimate communities from noisy datasets.

- Used GeoNames CA.txt only as a filter to identify candidate populated places (feature codes PPL, PPLA, RESV, etc.).  
- Pulled official names and coordinates exclusively from StatsCan Long placenames.csv.  
- Kept only entries where a GeoNames candidate matched a StatsCan entry within 50 km and had a compatible name (primary or alternate).  
- Noted flaws: GeoNames contained First Nations but only under outdated English names, and Quebec names were often incorrectly formatted.

## 3. Merging First Nations and Standard Communities

**Goal:** Produce a unified, authoritative dataset.

- Combined PlaceNameMaster.json with EnrichedFNs.csv.  
- When both datasets shared exact coordinates (5 decimal places), the First Nation record overwrote the standard one.  
- Some sites such as Yellowknife and Yellowknives Dene First Nation required manual unmerging. Similar anomalies may persist.

## 4. Spatial and Semantic Cleanup

**Goal:** Detect duplicates, near duplicates, and naming collisions.

Tools: Leaflet visualizer, nearest neighbor spreadsheet, Refiner Tool.

Refinement steps:

- **Self Cleaning:** Collapsed cases where bracketed text duplicated the base name (for example, "Unique (Unique River)" became "Unique River").  
- **Spatial Merging (under 1 km):** Treated hyper local duplicates as a single community.  
- **Typo Merging (under 10 km):** Merged entries differing only by accents, case, or minor spelling changes.  
- **First Nation Priority:**  
  Where standard entries overlapped Indigenous communities, First Nation records superseded them.  
  This corrects dataset distortions created when occupying colonial governments carved out portions of reserve land to build airports, RCMP precincts, clinics, christian churches, or other infrastructure used to support the occupation of Indigenous lands, including facilities intended to service residential schools. These imposed non reserve parcels appear as separate entries in federal datasets, creating duplicates for many Nations.

## 5. Collision Resolution

**Goal:** Resolve communities sharing identical names within the same province.

- Used duplicate inspector.html to generate JSON collision groups.  
- Used collision fixer.html for interactive renaming such as adding "(near X)".  
- For "X", preferred large bodies of water unlikely to have alternate local names.  
- For populated places, selected major centres when one community was under 2 hours away and the other was over 4 hours away.  
- Ensured no breaking changes to shortlist logic.

## 6. Shortlist, Whitelist and Advanced Name Parsing

**Goal:** Generate curated, accurate "major places" lists for compact front end use.

- Used a cities whitelist (philcampbell qhr) and spatial indexing to match against the master dataset.  
- GeoNames was used only to bridge ambiguous name matches. No data was stored.  
- Categorized matches into:  
  - Exempt and Matched  
  - Exempt and Unmatched  
  - Regular and Matched  
  - Regular and Unmatched  
- Detected whitelist errors (misspellings, greedy matches) via "unused" and "reused" categories.  
- Ensured all First Nations, Nunavut, and Northern Quebec communities were always included.  
- Added roughly one hundred small population places with outsized regional importance (for example, recreation hubs and weekend destinations).  
- Implemented advanced tokenization that ignores bracketed text beginning with "near" to prevent false matches.  
- Re ran shortlist generation after collision cleanup.  
- Output: placenames shortlist.json

## 7. Microlist

A final "microlist" was generated by reprocessing the shortlist against population data from Statistics Canada (CC0) and, where necessary, GeoNames population fields (used only as a filter and never stored).

Only places with a population greater than zero were included. This removes hamlets, seasonal settlements, and other named locations that do not receive their own census population count.

**Limitations:**

- Quebec appears to structure census units differently, resulting in some small but legitimate towns being excluded because they are aggregated into larger census entities.  
- Nova Scotia is heavily affected. Long chains of small communities, each with distinct placenames but populations of only a few hundred, often lack individual census records. As a result, many hamlets along highways or coastlines do not meet the criteria for inclusion in the microlist.

## 8. Coordinate Normalization

**Goal:** Reduce file size with minimal precision loss.

- Rounded all coordinates to 4 decimal places (approximately 11 meters of precision).  
- Reported byte savings and highlighted modified records.

## 9. Manual Corrections

**Goal:** Ensure dataset accuracy beyond automated workflows.

- Removed persistent non settlement and industrial entries that made it into the full list, such as radar stations and mines.  
- Normalized Quebec place names according to the Commission de toponymie du Quebec (Saint and Sainte rules, accents, punctuation, and spacing).
