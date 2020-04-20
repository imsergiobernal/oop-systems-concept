# Objective: avoid distributed systems when there are no needs.

[🗺 UML Diagram](UML.jpg)

A distributed system is in somewhere very useful. Boundaries are really explicit, but it has an
inherted complexity.

As a startup, we dont have _tribus_, or any kind of artefact which would indicate that we need
a distributed system. Instead, we have domain unknolowedge, we are constantly on complex and
complicated contexts because we are learning. Designing those boundaries are really complex and
changes a lot in the design process and, we don't really know if we are doing the right thing.

But this is not an excuse to have a _spaghetti pseudofunctional code_. We need to change fast,
we need to be able to distribute some need in some moment 🚀.

JavaScript modules are a nice way of thinking in objects and encapsulating states but, in my
experience, when you need to mix clases and name things, it becomes difficult to progress, so
I decided to model the whole Main System as Classes and thinking that they could be potentional
distributed deployments.

# What is a Main System?
Think Main System as a *Composition* of subsystems. Main System creates and orchestates them.
Similar as a IoC Container, but it has his own state.

# What is a Subsystem?
A subsystem is something stateful. I understand a subsystem as a distributed system but sharing
same runtime process.

# What is a Component?
A component is a proposal of Simon Brown at Eric Evans Clean Architecture's book. A component
is a hard-used, weak-defined word. This becomes a problem for human sharing knowledge and solution
design. In this case I'm following the Simon's Brown definition and his 'package by component' design.

![](https://raw.githubusercontent.com/ttulka/blog-assets/master/Package-by-component-with-clean-modules.png)

> My definition of a component is slightly different: “**A grouping of related
functionality** behind a nice clean interface, which resides inside an execution
environment like an application.” This definition comes from my “C4 software
architecture model,”7 which is a simple hierarchical way to think about the static
structures of a software system in terms of containers, components, and classes (or
code).

> ... Inside the component, the separation of concerns is still
maintained, so the business logic is separate from data persistence, but that’s a
component implementation detail that consumers don’t need to know about.

