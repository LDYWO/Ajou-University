\name{loo}
\alias{loo}
\encoding{latin1}
\title{Leave-one-out criterion}

\description{ The \code{loo()} function can be viewed as an internal
function. It is called by \code{estim.regul()} to obtain optimal values
for the two parameters of regularization.

}
\usage{
loo(X, Y, lambda1, lambda2)
}
%- maybe also 'usage' for other objects documented here.
\arguments{
  \item{X}{numeric matrix (n * p), containing the X coordinates.}
  \item{Y}{numeric matrix (n * q), containing the Y coordinates.}
  \item{lambda1}{parameter of regularization for X variables}
  \item{lambda2}{parameter of regularization for Y variables}
}


\author{Sébastien Déjean, Ignacio González}


\seealso{\code{\link{estim.regul}}}

\keyword{multivariate}