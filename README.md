# raisely-coding-challenge

An implementation of the 'tag picker' component, as per [the brief](https://raisely.notion.site/Technical-Assessment-Frontend-Engineer-01eefd9ea1384fafaed66ba9d8e8aa0e).

## Approach

I've made a few assumptions in implementing my solution. I thought it best to clarify them here, rather than letting them remain implicit.

In general, I've opted to treat the starting template as an existing codebase. So I've kept changes to project setup, structure and tooling to a minimum. For changes I did make, the intention was they would directly help me with the areas of focus emphasised in the brief: correctness, quality, and accessibility.

I felt this approach was more in-keeping with the exercise resembling a minor new feature -- a new component -- rather than a new application or project.

So to that end I haven't changed:
- the framework and language
- the setup/config/structure of `createreactapp`
- existing stylesheet tooling
- did not introduce any kind of central state storage/management libraries (like redux)
- have not made abstractions around the mocked API calls (anything like wrapping them in `react-async` hooks)
- (i.e. I focused on the feature rathen than setting up patters in the wider project that might be worth having 'irl')

Things that I have added:
1. React Testing Library and helper libraries
2. Eslint configuration to enable jsx-a11y (both of which come with `createreactapp`)

The rationale for adding these was to have some automation around code correctness and accesibility -- i.e. testing.

### Testing

My focus for testings was to:
- give the most confidence for least effort/time/maintenance burden
- resemble as closely as reasonably possible the way a user interacts with the new component
- test for accessibility as well as visual correctness

Additionally, to save time I re-used the existing mock data in testing -- i.e. the component 'fetches' the same mocked data in the same way in the test as it does when run in 'production' (using the same pretent backend functionality).

In a 'real life' scenario, I'd prefer to abstract the data-fetching layer in a way where tests can provide specific mocked data as needed.

Happy to discuss this in more detail, I just wanted to make a note of it :)

### Assumptions

I've made a few assumptions on points that weren't explicit in the brief:
- Loading state:
  - not specified in the brief but made sense to me to include
  - opted for a very  basic 'spinner'
- Errors:
  - assumed a 'real life' project would have some sort of accepted way of feeding errors back to the user (inline, toast, etc)
  - for this exercise just defined a stub-like error handling function
- Cancelling when adding a new tag (i.e. make the input go away):
  - escape key
  - no mobile-specific solution -- suggest click/tap outside of the component?
- New tag input behaviour on hover/leave:
  - input should not hide even when mouse leaves the tag picker, in the way the add button would hide
  - if the user has been asked to type some input, it would be janky to have the input disappear/reappear
- Not enforcing any constraints around creating a new tag:
  - a max length for new tag title
  - a title identical to an existing tag
    - backend should ideally handle that -- client should handle the error
- Assigning existing tags:
  - naively rendering all tags as suggestions, when user starts typing
  - not narrowing down based on user input
  - would need to clarify on the strategy/algorithm that would best serve the situation
- Too many tags to fit on one line:
  - simply wraping them to next line (not scrolling horizontally)
- Mobile in general:
  - Assumed anything that happens on hover on desktop would be done via focus on mobile (but having second thoughts... perhaps would be better as always visible on mobile)

In 'real life', I expect a lot of this would come up in discussion during planing and refinement/estimation phases.

For states and behaviours that weren't initially considered, I'd look to approach the designer(s) and product owner(s) I'm working with, at a cadence/frequency that's comfortable for all us. Basically, follow whatever the team's accepted iteration approach is.

For this exercise, I was mindful of Chris' time in terms of throwing questions his way too often.

Again, more than happy to talk to this in more detail :)