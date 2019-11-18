<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* partials/header.html.twig */
class __TwigTemplate_a70edc4f2ffcad90f697db108297516a2d26d92cacf64d121332b71ea212be00 extends \Twig\Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_319393461309892924ff6e74d6d6e64287df64b63545b994e100d4ab223aed02 = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_319393461309892924ff6e74d6d6e64287df64b63545b994e100d4ab223aed02->enter($__internal_319393461309892924ff6e74d6d6e64287df64b63545b994e100d4ab223aed02_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "template", "partials/header.html.twig"));

        // line 1
        echo "<header>
  <nav class=\"menu\">
    <ul class=\"menu__items\">
      <li class=\"menu__item\">
        <a class=\"menu__link text-menu\" href=\"\" target=\"_self\">
          Accueil
          <svg class=\"icon icon-home\">
            <use xlink:href=\"#icon-home\"></use>
          </svg>
        </a>
      </li>
      <li class=\"menu__item\">
        <a class=\"menu__link text-menu\" href=\"\" target=\"_self\">
          Favoris
          <svg class=\"icon icon-favorite\">
            <use xlink:href=\"#icon-favorite\"></use>
          </svg>
        </a>
      </li>
      <li class=\"menu__item\">
        <a class=\"menu__link text-menu\" href=\"\" target=\"_self\">
          Compte
          <svg class=\"icon icon-account\">
            <use xlink:href=\"#icon-account\"></use>
          </svg>
        </a>
      </li>
      <li class=\"menu__item\">
        <a class=\"menu__link text-menu\" href=\"\" target=\"_self\">
          Recherche
          <svg class=\"icon icon-search\">
            <use xlink:href=\"#icon-search\"></use>
          </svg>
        </a>
      </li>
    </ul>
  </nav>
</header>";
        
        $__internal_319393461309892924ff6e74d6d6e64287df64b63545b994e100d4ab223aed02->leave($__internal_319393461309892924ff6e74d6d6e64287df64b63545b994e100d4ab223aed02_prof);

    }

    public function getTemplateName()
    {
        return "partials/header.html.twig";
    }

    public function getDebugInfo()
    {
        return array (  40 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("<header>
  <nav class=\"menu\">
    <ul class=\"menu__items\">
      <li class=\"menu__item\">
        <a class=\"menu__link text-menu\" href=\"\" target=\"_self\">
          Accueil
          <svg class=\"icon icon-home\">
            <use xlink:href=\"#icon-home\"></use>
          </svg>
        </a>
      </li>
      <li class=\"menu__item\">
        <a class=\"menu__link text-menu\" href=\"\" target=\"_self\">
          Favoris
          <svg class=\"icon icon-favorite\">
            <use xlink:href=\"#icon-favorite\"></use>
          </svg>
        </a>
      </li>
      <li class=\"menu__item\">
        <a class=\"menu__link text-menu\" href=\"\" target=\"_self\">
          Compte
          <svg class=\"icon icon-account\">
            <use xlink:href=\"#icon-account\"></use>
          </svg>
        </a>
      </li>
      <li class=\"menu__item\">
        <a class=\"menu__link text-menu\" href=\"\" target=\"_self\">
          Recherche
          <svg class=\"icon icon-search\">
            <use xlink:href=\"#icon-search\"></use>
          </svg>
        </a>
      </li>
    </ul>
  </nav>
</header>", "partials/header.html.twig", "/Users/fionahetic/WEB/parizen/templates/partials/header.html.twig");
    }
}
