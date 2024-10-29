-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('ACTIVO', 'INACTIVO', 'BLOQUEADO');

-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "EstadoCuenta" AS ENUM ('ACTIVA', 'INACTIVA', 'BLOQUEADA');

-- CreateEnum
CREATE TYPE "EstadoTransaccion" AS ENUM ('EXITOSA', 'FALLIDA', 'PENDIENTE');

-- CreateEnum
CREATE TYPE "TipoFinanza" AS ENUM ('BANCO', 'CREDITO');

-- CreateEnum
CREATE TYPE "TipoTransaccion" AS ENUM ('PAGO', 'RETIRO', 'TRANSFERENCIA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "estado" "EstadoUsuario" NOT NULL,
    "rol" "RolUsuario" NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cuenta" (
    "id" SERIAL NOT NULL,
    "estado" "EstadoCuenta" NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoFinanza" NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Cuenta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaccion" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoTransaccion" NOT NULL,
    "descripcion" TEXT,
    "monto" DOUBLE PRECISION NOT NULL,
    "estado" "EstadoTransaccion" NOT NULL,
    "errores" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cuentaOrigenId" INTEGER,
    "cuentaDestinoId" INTEGER,

    CONSTRAINT "Transaccion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_username_key" ON "Usuario"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Cuenta" ADD CONSTRAINT "Cuenta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaccion" ADD CONSTRAINT "Transaccion_cuentaOrigenId_fkey" FOREIGN KEY ("cuentaOrigenId") REFERENCES "Cuenta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaccion" ADD CONSTRAINT "Transaccion_cuentaDestinoId_fkey" FOREIGN KEY ("cuentaDestinoId") REFERENCES "Cuenta"("id") ON DELETE SET NULL ON UPDATE CASCADE;
