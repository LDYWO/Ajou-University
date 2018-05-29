\name{estim.regul}
\alias{estim.regul}
\encoding{latin1}
\title{Estimate the parameters of regularization}

\description{
Calulate the leave-one-out criterion on a 2D-grid to determine optimal
values for the parameters of regularization.
}
\usage{
estim.regul(X, Y, grid1 = NULL, grid2 = NULL, plt = TRUE)
}
%- maybe also 'usage' for other objects documented here.
\arguments{
  \item{X}{numeric matrix (n * p), containing the X coordinates.}
  \item{Y}{numeric matrix (n * p), containing the X coordinates.}
  \item{grid1}{vector defining the values of lambda1 to be tested. If
  NULL, the vector is defined as \code{seq(0.001, 1, length = 5)}}
  \item{grid2}{vector defining the values of lambda2 to be tested. If
  NULL, the vector is defined as \code{seq(0.001, 1, length = 5)}}
  \item{plt}{logical argument indicating whether an image should be
    plotted by calling the \code{img.estim.regul()} function.}
}
\details{

}
\value{
  A 3-vector containing the 2 values of the parameters of regularization
  on which the leave-one-out criterion reached its maximum; and the
  maximal value reached on the grid.}


\author{Sébastien Déjean, Ignacio González}

\seealso{\code{\link{loo}}}
\examples{

#data(nutrimouse)
#X=as.matrix(nutrimouse$gene)
#Y=as.matrix(nutrimouse$lipid)
#res.regul = estim.regul(X,Y,c(0.01,0.5),c(0.1,0.2,0.3)) 
}
\keyword{multivariate}
