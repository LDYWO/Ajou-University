\name{img.matcor}
\alias{img.matcor}
\encoding{latin1}
\title{Image of correlation matrices}

\description{
Display images of the correlation matrices within and between two data matrices.
}

\usage{
img.matcor(correl, type = 1)
}

\arguments{
  \item{correl}{Correlation matrices as returned by the \code{matcor()} function}
  \item{type}{character determining the kind of plots to be produced:
either one ((p+q) * (p+q)) matrix or three matrices (p * p), (q * q) and (p * q)}
}

\details{
Matrices are pre-processed before calling the \code{image()} function in order to
get, as in the numerical representation, the diagonal from upper-left corner to
bottom-right one.
}


\author{Sébastien Déjean, Ignacio González}

\seealso{\code{\link{matcor}}}
\examples{
data(nutrimouse)
X=as.matrix(nutrimouse$gene)
Y=as.matrix(nutrimouse$lipid)
correl=matcor(X,Y)
img.matcor(correl)
img.matcor(correl,type=2)
}
\keyword{dplot}
