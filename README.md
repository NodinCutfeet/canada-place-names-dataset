# canada-place-names-dataset

A dataset of 8,494 Canadian place names with French and Indigenous characters, provinces, coordinates, and Indigenous identification. Includes a full metadata file for mapping, light GIS, and data enrichment/joins, plus a lightweight list for autocomplete and location-based UI tools. CC-BY licensed.

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

# What Each File Represents

### places-*.json

Contains:

- placename  
- province or territory  
- coordinates  
- isIndigenous boolean  

These files are ideal for mapping, data visualization, reference layers, and bridging datasets.

### names-*.json

Contains:

- lists of placenames grouped by province or territory  

These are optimized for front end web use such as autocomplete fields, search bars, and dropdown lists.

# Levels of Inclusion: Full List, Shortlist, and Microlist

This dataset includes three tiers:

- **Full List (8,494 places)**: Every community, including hamlets, villages, Indigenous communities, and seasonal settlements.
- **Shortlist (3,736 places)**: Medium sized towns, major Indigenous and municipal centres, regional hubs, and popular destinations.
- **Microlist (2,129 places)**: Only places that receive a distinct census population value, used as a proxy for national relevance.

Across all tiers, Indigenous communities are always included. This dataset uses a hybrid Indigenous identification model:

- All legally designated First Nations  
- All Inuit, Cree, Naskapi, and Indigenous-majority communities in Nunavut, Nunavik, and large portions of the territories  
- Northern and remote communities where 75 percent or more of the population is Indigenous  
- Communities whose Indigenous identity is recognized socially, culturally, or politically regardless of municipal or federal labeling  

The term “First Nation” is strictly a legal designation and a product of colonial administration. Indigenous identity and nationhood do not begin or end with federal categorization. This dataset centres Indigenous presence based on community reality, not colonial gatekeeping.

And fundamentally:

Canada is 100 percent stolen Indigenous land, from coast to coast to coast. Taken through centuries of violence, forced child removal and abuse, manmade famine and broken treaties by nations that invested heavily in the technologies and logistics of war. These were imposed on Nations whose cultures prioritized stewardship of people, land, and water. Over thirteen thousand years of stewardship undone in two centuries. Including Indigenous communities at every level of this dataset is the absolute minimum, and costs only a few extra kilobytes.

# Coverage Visualizer

This dataset includes an interactive tool called the **Coverage Visualizer**, built with Leaflet JS and OpenStreetMap tile layers. It provides a satellite and map based interface for exploring the data in detail.

The Coverage Visualizer allows you to:

- view every community as a point on the map  
- toggle between categories such as Indigenous, shortlist matches, microlist matches, and excluded points  
- search for any community in the dataset  
- zoom in to inspect the exact coordinates used  
- regenerate all derived JSON files from a single master file  

The tool reads from **data.js**, which acts as the source of truth for the entire project. I strongly recommend making edits or additions to **data.js**, because the four derived JSON files can be quickly regenerated from it. This avoids needing to hand edit multiple files and keeps the dataset clean and reproducible.

### Screenshot

![Coverage Visualizer Screenshot](coverage-visualizer-screenshot.png)

# Limitations and Important Notes

Communities that share identical names within the same province are given a "near X" tag to avoid collisions (for example: Coastal Township (near Big City) vs. Coastal Township (near Large River)).

Large water bodies were preferred for "X" because they tend to have consistent names. Major population centres were used when one community was under 2 hours away and the other was over 4 hours away.

Some Indigenous-majority communities may still appear under municipal names inherited from colonial administration. These names appear exactly as used in government datasets but are marked as Indigenous in metadata.

A handful of non settlements may still be present. I manually removed most mistaken entries such as truck stops, isolated radar bases, seasonal hunting cabins, ice road islands, abandoned outposts, and remote industrial sites, but some probably remain.

I kept Alert, Nunavut because it is continuously inhabited and is simply too interesting to exclude.

# License and Attribution Requirements

This dataset is licensed under the **Creative Commons Attribution 4.0 International License (CC BY 4.0)**.

In short, CC BY allows anyone to:

- copy, redistribute, and host the dataset  
- modify it  
- remix it  
- build commercial or non-commercial tools with it  

**as long as proper attribution is provided.**

---

## Not a Derivative of GeoNames or the Commission de toponymie du Québec

This dataset is not a derivative of GeoNames, nor is it a derivative of the Commission de toponymie du Québec (CTQ).

No CTQ text, descriptive fields, coordinate data, or proprietary formatting were copied.  
Only factual municipal names — which are not protected by copyright — were used, and new coordinates were generated by producing centroids from multiple official placename points and then fuzzing them by 300 meters. These generated centroids are original work.

Similarly, GeoNames was used strictly as a filter, never as a source of names or coordinates.

Every coordinate and every name in this repository originates from:

- Statistics Canada (CC0)  
- Commission de toponymie du Québec factual names  
- my own transformations, centroid generation, and formatting  
- my own Indigenous community dataset  

Because only factual data was used, and all coordinates and structures were independently generated, no copyright or database rights from CTQ or GeoNames apply.

---

## What Counts as a Derivative

Under CC BY 4.0, any dataset that uses or reproduces **the contents, structure, or outputs** of this dataset is considered a derivative work.

This includes but is not limited to:

- changing field names  
- removing fields  
- converting JSON to CSV  
- re-sorting records  
- filtering towns  
- merging this dataset with other datasets  
- building tools, apps, or visualizations  
- reusing records or subsets  
- embedding it in software or a database  

None of these actions remove the attribution requirement.  
If your dataset includes **any** record, coordinate, corrected name, or structural element derived from this one — whether one, one hundred, or all of them — your work is a derivative and must include attribution.

---

## How to Build a Non-Derivative Dataset (If You Refuse Attribution)

If someone wants to avoid attribution entirely, they must:

- use this dataset only as a filter or guide  
- re-parse the official CC0 Statistics Canada source directly  
- reconstruct all naming, formatting, coordinates, fuzzing, and selections independently  
- avoid copying my text, formatting, name variants, coordinate choices, or structural decisions  

That is the only way to produce a non-derivative dataset under CC BY.

---

## What I Do and Do Not Own

I do not own the names of towns, villages, hamlets, or Indigenous communities.  
Those are factual public names, which are not protected under Canadian copyright law.

However, I do own the following elements of this dataset as a **creative compilation**:

- the specific normalization and formatting rules applied throughout the dataset  
- the curated selections and categorization  
- the combined file structure of JSON outputs  
- the corrections to place names  
- the multi-stage deduplication logic  
- the "near" tags and collision-prevention logic  
- the centroid generation and 300 meter fuzzing for Quebec municipalities  
- the unique patterns created by the manual corrections and transformations  
- the shortlist, microlist, and full-list architectures  

These elements, taken together, uniquely fingerprint the dataset.  
If another dataset reproduces these values, patterns, selections, or structures, it is legally and practically a derivative work — regardless of intent.

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

Used strictly as a filter, never as a source of names or coordinates. GeoNames often contained outdated English names for Indigenous communities, incorrect Quebec formatting, and placenames I had never heard used in communities I know well. None of the actual GeoNames text or coordinates are included here.

### 3. Commission de toponymie du Québec

Used only for factual municipality names.  
No descriptive or textual content was copied.  
All coordinates were independently generated by calculating centroids of official named places within each municipality and then fuzzing them by 300 meters.

# Methodology Overview

## Summary

This dataset is built entirely from multiple CC0 Statistics Canada data files, factual municipality names from the Commission de toponymie du Québec, and several stages of original centroid generation, normalization, and manual cleanup. No names, coordinates, descriptive fields, or formatting from GeoNames or CTQ appear anywhere in the final files.

Because the dataset contains zero proprietary CTQ or GeoNames values, and every coordinate, name, and metadata field originates from CC0 sources, factual lists, or original work, this project is not a derivative database under Canadian, US, or European database rights frameworks. As a result, no CTQ or GeoNames attribution is required, and the dataset may be shared and reused under the Creative Commons Attribution 4.0 license.

---

## 1. First Nations and Indigenous Data Preparation

**Goal:** Produce a complete, province-tagged dataset of Indigenous communities using a hybrid approach.

- Loaded data from Indigenous Services Canada, which more frequently used the modern non English names for First Nations.  
- Added Indigenous communities from Nunavut, Nunavik, northern Quebec, and the territories that have populations over 75 percent Indigenous.  
- The source lacked province information in some cases, so an HTML tool cross referenced each entry with StatsCan placenames data using coordinate matching (including swapped column correction and band ID inference).  
- Verified matches using Haversine distance and flagged anything over 50 km.  
- Exported a cleaned and validated file of legally recognized First Nations and Indigenous-majority communities.

## 2. Building the Non Indigenous Master List

**Goal:** Extract legitimate communities from noisy datasets.

- Used GeoNames CA.txt only as a filter to identify candidate populated places (feature codes PPL, PPLA, RESV, etc.).  
- Pulled official names and coordinates exclusively from StatsCan Long placenames.csv.  
- Kept only entries where a GeoNames candidate matched a StatsCan entry within 50 km and had a compatible name (primary or alternate).  

## 3. Quebec Reconstruction from the Commission de toponymie du Québec

**Goal:** Restore complete and accurate Quebec coverage.

- Loaded the full CTQ dataset of official place names.  
- Filtered out:  
  - Hudson Bay regional district  
  - regions with only natural features  
  - features without municipalities  
- Extracted every unique municipality from the municipality column.  
- Calculated centroids by averaging coordinates from all named places within each municipality.  
- Fuzzed each centroid by 300 meters to avoid reproducing CTQ coordinate structures.  
- Merged these municipalities into the master dataset:  
  - when names and coordinates closely matched, the existing entry kept its coordinates and updated its official name  
  - neighbourhoods nested within municipalities were removed unless they were hamlets or villages  
  - hamlets/villages remained on the full list, while their parent municipality was promoted to the shortlist  

## 4. Merging Indigenous and Standard Communities

**Goal:** Produce a unified, authoritative dataset.

- Combined the Indigenous dataset with the non Indigenous master list.  
- When both datasets shared exact coordinates (5 decimal places), Indigenous records superseded municipal ones.  
- Some sites such as Yellowknife and Yellowknives Dene First Nation required manual unmerging.

## 5. Spatial and Semantic Cleanup

**Goal:** Detect duplicates, near duplicates, and naming collisions.

Tools: Leaflet visualizer, nearest neighbor spreadsheet, Refiner Tool.

Refinement steps:

- **Self Cleaning:** Collapsed cases where bracketed text duplicated the base name.  
- **Spatial Merging (under 1 km):** Treated hyper local duplicates as a single community.  
- **Typo Merging (under 10 km):** Merged entries differing only by accents, case, or minor spelling changes.  
- **Indigenous Priority:**  
  Where standard entries overlapped Indigenous communities, Indigenous records superseded them, correcting distortions created when occupying colonial governments carved out small lots for infrastructure inside Indigenous lands.

## 6. Collision Resolution

**Goal:** Resolve communities sharing identical names within the same province.

- Used duplicate inspector.html to generate JSON collision groups.  
- Used collision fixer.html for interactive renaming such as adding "(near X)".  
- For "X", preferred large bodies of water unlikely to have alternate local names.  
- For populated places, selected major centres when one community was under 2 hours away and the other was over 4 hours away.  
- Ensured no breaking changes to shortlist logic.

## 7. Shortlist, Whitelist and Advanced Name Parsing

**Goal:** Generate curated, accurate "major places" lists for compact front end use.

- Used a cities whitelist (philcampbell qhr) and spatial indexing to match against the master dataset.  
- GeoNames was used only to bridge ambiguous name matches. No data was stored.  
- Categorized matches into multiple match groups for debugging.  
- Ensured all Indigenous communities, Nunavut, and Northern Quebec communities were always included.  
- Added roughly one hundred small population places with outsized regional importance.  
- Implemented advanced tokenization that ignores bracketed text beginning with "near" to prevent false matches.  
- Re ran shortlist generation after collision cleanup.  
- Output: placenames shortlist.json

## 8. Microlist

A final "microlist" was generated by reprocessing the shortlist against population data from Statistics Canada (CC0) and, where necessary, GeoNames population fields (used only as a filter and never stored).

Only places with a population greater than zero were included.

## 9. Coordinate Normalization

**Goal:** Reduce file size with minimal precision loss.

- Rounded all coordinates to 4 decimal places (approximately 11 meters of precision).  
- Reported byte savings and highlighted modified records.

## 10. Manual Corrections

**Goal:** Ensure dataset accuracy beyond automated workflows.

- Removed persistent non settlement and industrial entries that made it into the full list, such as radar stations and mines.  
- Normalized Quebec place names according to the Commission de toponymie du Quebec (Saint and Sainte rules, accents, punctuation, and spacing).  
