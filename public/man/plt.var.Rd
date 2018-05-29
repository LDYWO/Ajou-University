\name{plt.var}
\alias{plt.var}
\encoding{latin1}
\title{Variables representation for CCA}
\description{
This function provides variables representation on the canonical variates.
}
\usage{
plt.var(res, d1, d2, int = 0.5, var.label = FALSE, Xnames = NULL, Ynames = NULL)
}

\arguments{
  \item{res}{Object returned by \code{cc} or \code{rcc}}
  \item{d1}{The dimension that will be represented on the horizontal axis}
  \item{d2}{The dimension that will be represented on the vertical axis}
  \item{int}{The radius of the inner circle}
  \item{var.label}{logical indicating whether label should be plotted on
  the variables representation}
  \item{Xnames}{vector giving the names of X variables}
  \item{Ynames}{vector giving the names of Y variables}
}

\references{www.lsp.ups-tlse.fr/Biopuces/CCA}

\author{Sébastien Déjean, Ignacio González}

\seealso{\code{\link{plt.indiv}}, \code{\link{plt.cc}}}

\keyword{dplot}
