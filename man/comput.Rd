\name{comput}
\alias{comput}
\encoding{latin1}
\title{Additional computations for CCA}
\description{
The \code{comput()} function can be viewed as an internal function. It is called by \code{cc()}
and \code{rcc} to perform additional computations. The user does not have to call it by himself.
}
\usage{
comput(X, Y, res)
}
\arguments{
  \item{X}{numeric matrix (n * p), containing the X coordinates.}
  \item{Y}{numeric matrix (n * q), containing the Y coordinates.}
  \item{res}{results provided by the \code{cc()} and \code{rcc()} functions.}
}

\value{
  A list containing the following components:
  \item{xscores}{X canonical variates}
  \item{yscores}{Y canonical variates}
  \item{corr.X.xscores}{Correlation bewteen X and X canonical variates}
  \item{corr.Y.xscores}{Correlation bewteen Y and X canonical variates}
  \item{corr.X.yscores}{Correlation bewteen X and Y canonical variates}
  \item{corr.Y.yscores}{Correlation bewteen Y and Y canonical variates}
}

\author{Sébastien Déjean, Ignacio González}

\seealso{\code{\link{cc}}, \code{\link{rcc}}
}
\keyword{multivariate}
